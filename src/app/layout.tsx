import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'Dash Auth',
  description: 'Simple, secure authentication platform',
  keywords: ['authentication', 'security', 'user management', 'auth platform'],
  authors: [{ name: 'Dash Auth Team' }],
  openGraph: {
    title: 'Dash Auth',
    description: 'Simple, secure authentication platform',
    type: 'website',
  },
  twitter: {
    title: 'Dash Auth',
    description: 'Simple, secure authentication platform',
    card: 'summary_large_image',
  },
};

function RootLoading() {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neutral-500/20 border-t-neutral-50 rounded-full animate-spin" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSansJP.variable}>
      <body className="antialiased font-noto-sans-jp bg-zinc-950">
        <AuthProvider>
          <Suspense fallback={<RootLoading />}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
