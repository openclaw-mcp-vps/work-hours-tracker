import { NextRequest, NextResponse } from "next/server";

import { hasPurchaseForEmail } from "@/lib/db";

const COOKIE_NAME = "wh_paid";
const EMAIL_COOKIE = "wh_email";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const hasAccess = await hasPurchaseForEmail(email);

  if (!hasAccess) {
    return NextResponse.json(
      {
        error: "No active purchase found for this email. Complete checkout first, then try again."
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  response.cookies.set(EMAIL_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  response.cookies.set(EMAIL_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
