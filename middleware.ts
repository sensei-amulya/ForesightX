import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/token";

export async function middleware(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await verifyToken(token) as any;

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-org-id", decoded.orgId);
        requestHeaders.set("x-user-id", decoded.userId);
        requestHeaders.set("x-role", decoded.role);

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

export const config = {
    matcher: ["/api/metrics/:path*", "/api/dashboard/:path*", "/api/reports/:path*", "/api/users/:path*", "/api/auth/change-password", "/api/audits", "/api/goals"],
};
