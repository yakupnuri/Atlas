'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Calendar, Newspaper, Settings, LogOut, Info } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      router.push('/admin');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  const menuItems = [
    {
      title: 'Over Ons Beheer',
      description: 'Beheer team, missie, visie en waarden',
      href: '/admin/about',
      icon: Info,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Evenementen',
      description: 'Beheer evenementen en reserveringen',
      href: '/admin/events',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      soon: true,
    },
    {
      title: 'Nieuws',
      description: 'Beheer nieuwsartikelen',
      href: '/admin/news',
      icon: Newspaper,
      color: 'from-orange-500 to-red-500',
      soon: true,
    },
    {
      title: 'Instellingen',
      description: 'Site configuratie',
      href: '/admin/settings',
      icon: Settings,
      color: 'from-gray-500 to-gray-700',
      soon: true,
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Stichting Atlas" width={120} height={40} className="h-10 w-auto" />
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welkom terug!</h2>
          <p className="text-gray-600">Beheer uw website content en instellingen</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.soon ? (
                <div className="relative bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-not-allowed opacity-60">
                  <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Binnenkort
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
