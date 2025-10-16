'use client'

import { useState, useEffect } from 'react';
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
  FolderKanban,
  Heart,
  User,
  Circle,
  MessageCircle
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pagesMenuOpen, setPagesMenuOpen] = useState(true);
  const [crmMenuOpen, setCrmMenuOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(1);

  useEffect(() => {
    // Get current user from localStorage
    const userEmail = localStorage.getItem('adminEmail');
    const adminToken = localStorage.getItem('adminToken');
    
    if (!userEmail || !adminToken) {
      // Not logged in, redirect to login
      window.location.href = '/admin/login';
      return;
    }
    
    if (userEmail) {
      setCurrentUser({
        email: userEmail,
        name: userEmail.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.split('@')[0])}&background=05B6C4&color=fff&bold=true`
      });
    }

    // Simulate online users count (in real app, this would come from WebSocket or API)
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 3) + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
      title: 'Etkinlikler',
      icon: Calendar,
      href: '/admin/evenementen',
    },
    {
      title: 'Bağışlar',
      icon: Heart,
      href: '/admin/donaties',
    },
    {
      title: 'Eğitim Merkezi',
      icon: GraduationCap,
      href: '/admin/educatie',
    },
    {
      title: 'Kariyer Merkezi Yönetimi',
      icon: Briefcase,
      href: '/admin/kariyer',
    },
    {
      title: 'Reacties Beheer',
      icon: MessageCircle,
      href: '/admin/comments',
    },
  ];

  // CRM Menu Items
  const crmMenuItems = [
    {
      title: 'Projeler',
      icon: FolderKanban,
      href: '/crm/projeler',
    },
    {
      title: 'Fonlar',
      icon: Heart,
      href: '/crm/fonlar',
      badge: 'Yakında'
    },
    {
      title: 'Gönüllüler',
      icon: Users,
      href: '/crm/gonulluler',
      badge: 'Yakında'
    },
    {
      title: 'Bağışlar',
      icon: Heart,
      href: '/crm/bagislar',
      badge: 'Yakında'
    },
    {
      title: 'Ticari Gelirler',
      icon: FileText,
      href: '/crm/ticari-gelirler',
      badge: 'Yakında'
    },
    {
      title: 'Toplantılar',
      icon: Calendar,
      href: '/crm/toplantilar',
      badge: 'Yakında'
    },
    {
      title: 'Raporlar',
      icon: FileStack,
      href: '/crm/raporlar',
      badge: 'Yakında'
    },
    {
      title: 'Ayarlar',
      icon: Settings,
      href: '/crm/ayarlar',
      badge: 'Yakında'
    },
  ];

  const pagesMenuItems = [
    {
      title: 'Over Ons',
      icon: Info,
      href: '/admin/pages/over-ons',
    },
    {
      title: 'Carrière Center',
      icon: Briefcase,
      href: '/admin/pages/carriere-center',
    },
    {
      title: 'Projectgroep',
      icon: FolderKanban,
      href: '/admin/pages/projectgroep',
    },
    {
      title: 'Nieuws',
      icon: Newspaper,
      href: '/admin/nieuws',
    },
    {
      title: 'ANBI',
      icon: FileText,
      href: '/admin/anbi',
    },
    {
      title: 'Contact',
      icon: Phone,
      href: '/admin/pages/contact',
    },
  ];

  const bottomMenuItems = [
    {
      title: 'Ayarlar',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = '/admin/login';
  };

  // Check authentication
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Main Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            // Check if item is restricted and user doesn't have access
            if (item.restrictedTo) {
              const hasAccess = currentUser?.email?.endsWith(item.restrictedTo);
              if (!hasAccess) {
                return null; // Don't show restricted items to unauthorized users
              }
            }
            
            // External link (opens in same tab)
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </a>
              );
            }
            
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

          {/* Sayfalar Menüsü */}
          <div className="mt-4">
            <button
              onClick={() => setPagesMenuOpen(!pagesMenuOpen)}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-white/10 transition-all"
            >
              <FileStack className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium flex-1 text-left">Sayfalar</span>
                  {pagesMenuOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </>
              )}
            </button>

            {/* Sayfalar Alt Menüsü */}
            {pagesMenuOpen && sidebarOpen && (
              <div className="mt-2 ml-4 space-y-1">
                {pagesMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        isActive
                          ? 'bg-white text-[#05B6C4] shadow-lg'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Alt Menü (Ayarlar) */}
          <div className="mt-4 pt-4 border-t border-white/20">
            {bottomMenuItems.map((item) => {
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
          </div>
        </nav>

        {/* User Profile Section */}
        {currentUser && (
          <div className="mt-auto p-4 border-t border-white/20">
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-400 fill-green-400" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-white/70 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <div className="flex items-center gap-1">
                      <Circle className="w-2 h-2 text-green-400 fill-green-400" />
                      <span>{onlineUsers} Kullanıcı Çevrimiçi</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
