'use client'
import { Geist, Geist_Mono } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar/AppSidebar';
import AuthProvider from '@/components/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';



const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        {isLoginPage ? (
          // Login page without sidebar and auth protection
          children
        ) : (
          <AuthProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <main>
                  <SidebarTrigger className="m-2" />
                  <div className="max-w-screen">{children}</div>
                </main>
              </SidebarInset>
            </SidebarProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}