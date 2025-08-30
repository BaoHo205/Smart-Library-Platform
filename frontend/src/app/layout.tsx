import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/sidebar/AppSidebar';
import { getUserRole } from '@/lib/cookies/auth';
import { headers } from 'next/headers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRole();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Pages where sidebar should be hidden
  const hideSidebarPages = ['/login'];
  const shouldHideSidebar = hideSidebarPages.some(page =>
    pathname.startsWith(page)
  );

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <SonnerToaster position="top-right" />
        <AuthProvider>
          {shouldHideSidebar ? (
            <main>{children}</main>
          ) : (
            <SidebarProvider>
              <AppSidebar userRole={userRole} />
              <SidebarInset>
                <main>
                  <SidebarTrigger className="m-2" />
                  <div className="max-w-screen">{children}</div>
                </main>
              </SidebarInset>
            </SidebarProvider>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
