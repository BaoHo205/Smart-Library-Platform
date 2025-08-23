import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication status from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value as
    | 'user'
    | 'staff'
    | undefined;

  const isAuthenticated = !!accessToken;

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login page
  if (isAuthenticated && pathname === '/login') {
    const redirectUrl = '/';
    const dashboardUrl = new URL(redirectUrl, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

// Role-based route protection
  if (isAuthenticated && userRole) {
    // Define allowed paths for user
    const userAllowedPaths: string[] = [
      '/',
      '/books',
      '/me',
      '/loans',
      '/analytics',
    ];

    const isUserAllowedPath = userAllowedPaths.includes(pathname);

    // User trying to access paths not in their allowed list
    if (userRole === 'user' && !isUserAllowedPath && !isPublicRoute) {
      const userUrl = new URL('/', request.url);
      return NextResponse.redirect(userUrl);
    }
  }

    // Create response and add pathname header for layout to use
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any file with common image extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};
