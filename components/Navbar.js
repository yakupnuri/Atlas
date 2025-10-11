'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Calendar, Heart, Users, Newspaper, Info, Globe } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Hakkımızda', icon: Info },
    { href: '/events', label: 'Etkinlikler', icon: Calendar },
    { href: '/news', label: 'Haberler', icon: Newspaper },
    { href: '/reserveren', label: 'Rezervasyon', icon: Users },
    { href: '/doneren', label: 'Bağış', icon: Heart },
  ];

  const languages = [
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="Stichting Atlas" 
              width={180} 
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#05B6C4] transition-colors font-medium flex items-center gap-2"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-[#05B6C4]"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-700 hover:text-[#05B6C4] hover:bg-gray-50 px-4 rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
