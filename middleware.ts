import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default auth((req) => {
  const url = req.nextUrl;
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  if (!req.auth) {
    if (path !== "/login") {
      return NextResponse.redirect(new URL(`/login`, `https://${hostname}`));
    }
  }
  if (req.auth) {
    if (path == "/login" || path == "/") {
      return NextResponse.redirect(
        new URL(`/dashboard`, `https://${hostname}`),
      );
    }
  }
});
