import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder");

export type StripePurchase = {
  email: string;
  sessionId: string;
  purchasedAt: string;
};

export function verifyStripeEvent(rawBody: string, signature: string | null): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }

  if (!signature) {
    throw new Error("Missing stripe-signature header.");
  }

  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

export function extractPurchaseFromStripeEvent(event: Stripe.Event): StripePurchase | null {
  if (event.type !== "checkout.session.completed") {
    return null;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email?.trim().toLowerCase();

  if (!email) {
    return null;
  }

  return {
    email,
    sessionId: session.id,
    purchasedAt: new Date().toISOString()
  };
}
