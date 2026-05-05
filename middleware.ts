import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // ถ้ามี token แปลว่า Login แล้ว
    },
    pages: {
      signIn: "/", // ถ้ายังไม่ Login ให้เด้งกลับไปที่ app/page.tsx (คือพาธ /)
    },
  }
);

// กำหนดว่า Path ไหนบ้างที่ต้องโดนบังคับ Login
export const config = {
  matcher: [
    "/main/:path*",
    "/chat/:path*"
  ],
};
