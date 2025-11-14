// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access-token')?.value;
    const { pathname } = request.nextUrl;


    // Route groups to protect (matches the folder structure)
    const protectedRoutes = [
        '/(protected)', // All routes under /(protected) group
        '/dashboard',   // Legacy support (if keeping pages directory)
        '/profile'      // Legacy support
    ];

    const guestOnlyRoutes = [
        '/(auth)',      // All routes under /(auth) group
        '/login',       // Legacy support
        '/register'     // Legacy support
    ];

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route) ||
        pathname === '/'
    );

    // Check if current path is guest-only
    const isGuestOnlyRoute = guestOnlyRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !token) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();

    // Redirect authenticated users from guest-only routes
    if (!isProtectedRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, etc.
         * - api/auth routes (if using NextAuth.js)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)',
    ],
};







