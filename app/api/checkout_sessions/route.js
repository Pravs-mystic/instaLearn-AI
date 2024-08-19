import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};


export async function POST(req) {
  const url = new URL(req.url);
  const isYearly = url.searchParams.get('yearly') === 'true';

  const params = {
    mode: "subscription",
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: isYearly ? "Pro Subscription (Yearly)" : "Pro Subscription (Monthly)"
          },
          unit_amount: formatAmountForStripe(isYearly ? 4 : 9.99),
          recurring: {
            interval:  "month",
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get("origin")}/payment_status?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get("origin")}/payment_cancelled`,
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}

