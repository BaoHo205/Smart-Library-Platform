import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication status from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value as 'user' | 'staff' | undefined;
  
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
    const redirectUrl = userRole === 'staff' ? '/staff' : '/user';
    const dashboardUrl = new URL(redirectUrl, request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Role-based route protection
  if (isAuthenticated && userRole) {
    const isStaffRoute = pathname.startsWith('/staff');
    const isUserRoute = pathname.startsWith('/user');
    
    // Staff trying to access user routes
    if (userRole === 'staff' && isUserRoute) {
      const staffUrl = new URL('/staff', request.url);
      return NextResponse.redirect(staffUrl);
    }
    
    // User trying to access staff routes
    if (userRole === 'user' && isStaffRoute) {
      const userUrl = new URL('/user', request.url);
      return NextResponse.redirect(userUrl);
    }
    
    // Redirect from root to appropriate dashboard
    if (pathname === '/') {
      const redirectUrl = userRole === 'staff' ? '/staff' : '/user';
      const dashboardUrl = new URL(redirectUrl, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    
    // If authenticated but not on a role-specific route and not on public route
    if (!isStaffRoute && !isUserRoute && !isPublicRoute) {
      const redirectUrl = userRole === 'staff' ? '/staff' : '/user';
      const dashboardUrl = new URL(redirectUrl, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static image files)
     * - public (other public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};