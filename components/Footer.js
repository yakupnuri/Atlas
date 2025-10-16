'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import ContactModal from './ContactModal';

export default function Footer() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                  <Link href="/over" className="hover:text-[#05B6C4] transition-colors">
                    Over Ons
                  </Link>
                </li>
                <li>
                  <Link href="/evenementen" className="hover:text-[#05B6C4] transition-colors">
                    Evenementen
                  </Link>
                </li>
                <li>
                  <Link href="/nieuws" className="hover:text-[#05B6C4] transition-colors">
                    Nieuws
                  </Link>
                </li>
                <li>
                  <Link href="/doneren" className="hover:text-[#05B6C4] transition-colors">
                    Doneren
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-[#05B6C4]" />
                  <a href="mailto:info@stichtingatlas.com" className="hover:text-[#05B6C4] transition-colors">
                    info@stichtingatlas.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-[#05B6C4]" />
                  <a href="tel:+31123456789" className="hover:text-[#05B6C4] transition-colors">
                    +31 (0)12 345 6789
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#05B6C4]" />
                  <span>Amsterdam, Nederland</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h3 className="text-white font-semibold mb-4">Neem Contact Op</h3>
              <p className="text-sm mb-4">
                Heeft u vragen? Wij helpen u graag verder!
              </p>
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Opnemen
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Stichting Atlas. Alle rechten voorbehouden.</p>
            <p className="mt-2 text-gray-500">ANBI erkend</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
}
