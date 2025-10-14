import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#05B6C4] to-[#3B87BE] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SA</span>
              </div>
              <span className="text-xl font-bold text-white">Stichting Atlas</span>
            </div>
            <p className="text-sm leading-relaxed">
              Samen bouwen we aan een inclusieve gemeenschap waar iedereen zich welkom voelt.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Snelle Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="hover:text-[#05B6C4] transition-colors">
                  Evenementen
                </Link>
              </li>
              <li>
                <Link href="/reserveren" className="hover:text-[#05B6C4] transition-colors">
                  Reserveren
                </Link>
              </li>
              <li>
                <Link href="/doneren" className="hover:text-[#05B6C4] transition-colors">
                  Doneren
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-[#05B6C4]" />
                <span>info@stichtingatlas.nl</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#05B6C4]" />
                <span>Amsterdam, Nederland</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Stichting Atlas. Alle rechten voorbehouden.</p>
          <p className="mt-2 text-gray-500">ANBI erkend</p>
        </div>
      </div>
    </footer>
  );
}
