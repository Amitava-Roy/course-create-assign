// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// You can define role-based routes here
const protectedRoutes = [
  { path: "/admin", role: "admin" },
  { path: "/user", role: "user" },
];

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      role: string;
    };

    const matchedRoute = protectedRoutes.find((route) =>
      req.nextUrl.pathname.startsWith(route.path)
    );
    if (matchedRoute && decoded.role !== matchedRoute.role) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

// Apply to all protected paths
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
