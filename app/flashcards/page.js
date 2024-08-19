'use client'
import { useUser} from "@clerk/nextjs";
import {use, useState, useEffect } from "react";
import { collection,CollectionReference, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";
import dynamic from 'next/dynamic';

const Flashcard = dynamic(() => import('../flashcard/page'), { ssr: false });


export default function Flashcards() {
    const router = useRouter();
    const [flashcards, setFlashcards] = useState([]);
    const {isLoaded, isSignedIn, user} = useUser();
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    
    useEffect(() => {
        async function getFlashcards() {
            if (!user) {
                return;
            }
            const docRef = doc(collection(db, "users"), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                console.log(collections);
                setFlashcards(collections);
            }
            else{
                await setDoc(docRef, {flashcards: []});
            }
        }
        getFlashcards();
    }, [user]);

    if(!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

      
    
    const handleCardClick = (name) => {
        // router.push(`/flashcard?id=${id}`);
        setSelectedFlashcard(name);
    }

    return(
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom mb={4}>
                Your Flashcards
            </Typography>
            <Grid container spacing={2}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                        <Card sx={{ backgroundColor: 'rgb(225 188 240 / 87%)' }}>
                            <CardActionArea onClick={() => {handleCardClick(flashcard.name)}}>
                                <CardContent>
                                    <Typography variant="h5">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedFlashcard && (
                <Box mt={4}>
                    <Flashcard search={selectedFlashcard} />
                </Box>
            )}
        </Container>
    )

}