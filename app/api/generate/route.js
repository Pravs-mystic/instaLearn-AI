import { NextResponse } from "next/server";
import openAI from "openai";

const systemPrompt = `You are an AI assistant designed to create educational flashcards. Your task is to generate a set of flashcards based on the given topic or content. Each flashcard should consist of a question on front side and the corresponding answer on the back side. Follow these guidelines:

1. Create clear and concise questions that focus on key concepts, facts, or definitions.
2. Provide accurate and informative answers that directly address the questions.
3. Ensure that the content is appropriate for the intended educational level.
4. Use simple language and avoid unnecessary jargon unless it's essential to the topic.
5. Aim for a mix of different question types (e.g., definitions, explanations, comparisons, examples).
6. Format the output as a JSON array of objects, where each object represents a flashcard with 'question' and 'answer' properties.

Example output format(follow the naming of keys as given in the JSON):
{
  "flashcards":[
        {
        "front": "What is photosynthesis?",
        "back": "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar."
        }
    ]
}

Please generate flashcards based on the provided topic or content.`;

export async function POST(req) {
    const openai = new openAI();
    const data = await req.text();

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            {role: "user", content: data}
        ],
        response_format: { type: "json_object" },
    });

    const flashcards = JSON.parse(completion.choices[0].message.content);
    // const flashcards = {
    //     flashcards: [
    //       {
    //         front: "What does the term 'laser' stand for?",
    //         back: 'Laser stands for Light Amplification by Stimulated Emission of Radiation.Laser stands for Light Amplification by Stimulated Emission of Radiation. Laser stands for Light Amplification by Stimulated Emission of Radiation.v Laser stands for Light Amplification by Stimulated Emission of Radiation.'
    //       },
    //       {
    //         front: 'How does a laser work?',
    //         back: 'A laser works by emitting a highly concentrated beam of light through the process of stimulated emission, where atoms release photons of light energy.'
    //       },
    //       {
    //         front: 'What is coherence in relation to lasers?',
    //         back: 'Coherence refers to the property of a laser beam where all the photons have the same frequency and phase, resulting in a well-defined and stable beam.'
    //       },
    //       {
    //         front: 'What are some common applications of lasers?',
    //         back: 'Common applications of lasers include laser cutting, laser welding, laser marking, laser engraving, medical procedures, laser pointers, and optical communication.'
    //       }
    //     ]
    //   }
    console.log(flashcards);
    return NextResponse.json(flashcards.flashcards);
}