'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Info, 
  FileText,
  Menu,
  X,
  LogOut,
  Users,
  Settings,
  FileStack,
  ChevronDown,
  ChevronRight,
  Phone,
  GraduationCap,
  Briefcase,
  FolderKanban
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      title: 'Kullanıcılar',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Haberler',
      icon: Newspaper,
      href: '/admin/nieuws',
    },
    {
      title: 'Etkinlikler',
      icon: Calendar,
      href: '/admin/evenementen',
    },
    {
      title: 'Over Ons',
      icon: Info,
      href: '/admin/about',
    },
    {
      title: 'ANBI',
      icon: FileText,
      href: '/admin/anbi',
    },
    {
      title: 'Ayarlar',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/auth/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-[#05B6C4] to-[#3B87BE] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-white/20">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <Image src="/web-logo.png" alt="Logo" width={40} height={40} className="rounded" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-[#05B6C4] shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
