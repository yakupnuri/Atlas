'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Calendar, Heart, Users, Newspaper, Info, FileText, ChevronDown, GraduationCap } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/over', label: 'Over Ons', icon: Info },
    { 
      href: '/academie', 
      label: 'Atlas Academie', 
      icon: GraduationCap,
      dropdown: [
        { href: '/academie/cultuur-educatie', label: 'Cultuur & Educatiecentrum' },
        { href: '/academie/carriere', label: 'Carrièrecentrum' },
        { href: '/academie/projectgroep', label: 'Projectgroep' }
      ]
    },
    { 
      href: '/evenementen', 
      label: 'Evenementen', 
      icon: Calendar,
      dropdown: [
        { href: '/evenementen', label: 'Evenementen' },
        { href: '/reserveren', label: 'Reserveren' }
      ]
    },
    { href: '/nieuws', label: 'Nieuws', icon: Newspaper },
    { href: '/anbi', label: 'ANBI', icon: FileText },
    { href: '/doneren', label: 'Doneren', icon: Heart },
  ];

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

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
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <div key={link.href} className="relative group">
                {link.dropdown ? (
                  <>
                    <button
                      className="text-gray-700 hover:text-[#05B6C4] transition-colors font-medium flex items-center gap-1"
                      onMouseEnter={() => setOpenDropdown(index)}
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === index && (
                      <div 
                        className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[220px] z-50"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#05B6C4] transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-[#05B6C4] transition-colors font-medium flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Language Selector */}
            <LanguageSwitcher />
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
            {navLinks.map((link, index) => (
              <div key={link.href}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="w-full text-left py-2 px-4 text-gray-700 hover:text-[#05B6C4] hover:bg-gray-50 rounded transition-colors flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === index && (
                      <div className="pl-4 bg-gray-50">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 px-4 text-gray-600 hover:text-[#05B6C4] transition-colors text-sm"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-gray-700 hover:text-[#05B6C4] hover:bg-gray-50 px-4 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-4 px-4">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
