import { NextRequest, NextResponse } from "next/server";

import { addPurchase } from "@/lib/db";
import { extractPurchaseFromStripeEvent, verifyStripeEvent } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text();

  try {
    const event = verifyStripeEvent(rawBody, request.headers.get("stripe-signature"));
    const purchase = extractPurchaseFromStripeEvent(event);

    if (!purchase) {
      return NextResponse.json({ received: true, ignored: true });
    }

    await addPurchase({
      email: purchase.email,
      source: "stripe",
      purchasedAt: purchase.purchasedAt,
      sessionId: purchase.sessionId
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
