import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req, { params }) {
  const { session_id } = params;
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Retrieved checkout session:", checkoutSession);
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error("Retrieve checkout session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}