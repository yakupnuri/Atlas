'use client'

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer for admin and CRM pages
  const isAdminPage = pathname?.startsWith('/admin');
  const isCRMPage = pathname?.startsWith('/crm');
  const hideNavAndFooter = isAdminPage || isCRMPage;

  return (
    <html lang="nl">
      <body className={inter.className}>
        <SessionProvider>
          <LanguageProvider>
            {!hideNavAndFooter && <Navbar />}
            <main className="min-h-screen">
              {children}
            </main>
            {!hideNavAndFooter && <Footer />}
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
