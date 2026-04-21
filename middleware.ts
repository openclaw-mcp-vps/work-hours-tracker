import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const hasPaidCookie = request.cookies.get("wh_paid")?.value === "1";

  if (!hasPaidCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/access";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
