'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/over', label: 'Over Ons' },
    { 
      href: '/academie', 
      label: 'Atlas Academie',
      dropdown: [
        { href: '/academie/cultuur-educatie', label: 'Cultuur & Educatiecentrum' },
        { href: '/academie/carriere', label: 'Carrièrecentrum' },
        { href: '/academie/projectgroep', label: 'Projectgroep' }
      ]
    },
    { 
      href: '/evenementen', 
      label: 'Evenementen',
      dropdown: [
        { href: '/evenementen', label: 'Alle Evenementen' },
        { href: '/reserveren', label: 'Reservering Maken' }
      ]
    },
    { href: '/nieuws', label: 'Nieuws' },
    { href: '/anbi', label: 'ANBI' },
    { href: '/doneren', label: 'Doneren', special: true },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
            <Image 
              src="/logo.png" 
              alt="Stichting Atlas" 
              width={160} 
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              
              return (
                <div 
                  key={link.href} 
                  className="relative"
                  onMouseEnter={() => link.dropdown && setOpenDropdown(index)}
                  onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
                >
                  {link.dropdown ? (
                    <>
                      <button
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1 ${
                          active
                            ? 'text-[#05B6C4] bg-[#05B6C4]/5'
                            : 'text-gray-700 hover:text-[#05B6C4] hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div 
                        className={`absolute top-full left-0 mt-2 transition-all duration-200 ${
                          openDropdown === index 
                            ? 'opacity-100 visible translate-y-0' 
                            : 'opacity-0 invisible -translate-y-2'
                        }`}
                      >
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[240px] overflow-hidden">
                          {link.dropdown.map((item) => {
                            const itemActive = pathname === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-2.5 text-sm transition-all ${
                                  itemActive
                                    ? 'text-[#05B6C4] bg-[#05B6C4]/5 font-medium'
                                    : 'text-gray-700 hover:text-[#05B6C4] hover:bg-gray-50'
                                }`}
                              >
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        link.special
                          ? 'bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white hover:shadow-lg hover:scale-105'
                          : active
                          ? 'text-[#05B6C4] bg-[#05B6C4]/5'
                          : 'text-gray-700 hover:text-[#05B6C4] hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              );
            })}
            
            {/* Language Selector */}
            <div className="ml-2 pl-2 border-l border-gray-200">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-1 border-t border-gray-100">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              
              return (
                <div key={link.href}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
                          active
                            ? 'text-[#05B6C4] bg-[#05B6C4]/5'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Mobile Dropdown */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ${
                          openDropdown === index ? 'max-h-[300px]' : 'max-h-0'
                        }`}
                      >
                        <div className="pl-4 py-2 space-y-1">
                          {link.dropdown.map((item) => {
                            const itemActive = pathname === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                                  itemActive
                                    ? 'text-[#05B6C4] bg-[#05B6C4]/5 font-medium'
                                    : 'text-gray-600 hover:text-[#05B6C4] hover:bg-gray-50'
                                }`}
                              >
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`block px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        link.special
                          ? 'bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white text-center'
                          : active
                          ? 'text-[#05B6C4] bg-[#05B6C4]/5'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              );
            })}
            
            {/* Mobile Language Selector */}
            <div className="px-4 pt-4 border-t border-gray-100">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
