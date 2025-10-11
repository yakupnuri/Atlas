import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stichting Atlas - Samen bouwen aan een inclusieve gemeenschap',
  description: 'Stichting Atlas biedt programma\'s en evenementen voor een diverse en inclusieve gemeenschap in Amsterdam.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
