import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
          <AuthProvider>
            <main>
              <div className="max-w-screen">{children}</div>
            </main>
          </AuthProvider>
      </body>
    </html>
  );
}
