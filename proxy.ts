import { NextResponse, type NextRequest } from "next/server";
import { adminCookie, verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const open = pathname === "/admin/giris" || pathname === "/api/admin/login";
  const authed = verifyToken(request.cookies.get(adminCookie)?.value);

  if (open) {
    if (authed && pathname === "/admin/giris") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  const login = new URL("/admin/giris", request.url);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
