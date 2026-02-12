import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (token && !token.completed && pathname !== "/create-profile") {
      return NextResponse.redirect(new URL("/create-profile", req.url));
    }

    if (token && token.completed && pathname === "/create-profile") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/chat/:path*", 
    "/create-profile",
    "/feed"
  ],
};