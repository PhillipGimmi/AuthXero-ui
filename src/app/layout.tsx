import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "AuthXero",
  description: "Authentication platform",
};

function RootLoading() {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Suspense fallback={<RootLoading />}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}