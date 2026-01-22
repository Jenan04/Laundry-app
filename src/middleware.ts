// import { getToken } from "next-auth/jwt";
// import { NextResponse, NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//     const token = await getToken({req});

//     if(!token) return NextResponse.next();
//     if(!token.completed && req.nextUrl.pathname === "/create-profile")
//         return NextResponse.redirect(new URL("/create-profile", req.url)) 
    
//     if(token.completed && req.nextUrl.pathname === "/create-profile")
//         return NextResponse.redirect(new URL("/", req.url)) 

//     return NextResponse.next();
// }

// export const config = {
//   matcher: ["/post-auth"],
// };
import { withAuth } from "next-auth/middleware"; // is a method that protects your pages from unotherized allow

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (token && token.completed === false && pathname !== "/create-profile") {
      return Response.redirect(
        new URL("/create-profile", req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|assets|favicon.webp|favicon.ico|signup|login|$).*)"],// بنحدد هان اي صفحات رح يتطبق عليها الميدلوير
};
