import './globals.css';
import { ReactNode } from 'react';
import Navbar from './components/Navbar';
import { ChakraProvider } from '@chakra-ui/react';

export const metadata = {
  title: 'AuthXero',
  description: 'Authentication as a Service',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <Navbar />
          <main>{children}</main>
        </ChakraProvider>
      </body>
    </html>
  );
}
