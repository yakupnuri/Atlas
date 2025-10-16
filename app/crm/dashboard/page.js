'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  DollarSign, 
  Calendar,
  FileText,
  Settings,
  LogOut,
  Loader2,
  Lock
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function CRMDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/academie/projectgroep');
      return;
    }

    // Check if user has CRM access
    const hasAccess = 
      session.user.email?.endsWith('@stichtingatlas.com') || 
      session.user.provider === 'crm-credentials';

    if (!hasAccess) {
      router.push('/academie/projectgroep');
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/academie/projectgroep' });
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const modules = [
    {
      title: 'Projeler',
      description: 'Tüm projeleri görüntüle ve yönet',
      icon: FolderOpen,
      href: '/crm/projeler',
      color: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      title: 'Fonlar',
      description: 'Fon başvurularını takip et',
      icon: DollarSign,
      href: '/crm/fonlar',
      color: 'from-green-500 to-emerald-500',
      available: false
    },
    {
      title: 'Gönüllüler',
      description: 'Gönüllü başvurularını yönet',
      icon: Users,
      href: '/crm/gonulluler',
      color: 'from-purple-500 to-pink-500',
      available: false
    },
    {
      title: 'Bağışlar',
      description: 'Bağış kayıtları ve makbuzlar',
      icon: DollarSign,
      href: '/crm/bagislar',
      color: 'from-orange-500 to-red-500',
      available: false
    },
    {
      title: 'Ticari Gelirler',
      description: 'Ticari gelir kayıtları',
      icon: FileText,
      href: '/crm/ticari-gelirler',
      color: 'from-yellow-500 to-orange-500',
      available: false
    },
    {
      title: 'Toplantılar',
      description: 'Toplantı takvimi ve notlar',
      icon: Calendar,
      href: '/crm/toplantilar',
      color: 'from-indigo-500 to-purple-500',
      available: false
    },
    {
      title: 'Raporlar',
      description: 'Detaylı raporlar ve analizler',
      icon: FileText,
      href: '/crm/raporlar',
      color: 'from-pink-500 to-rose-500',
      available: false
    },
    {
      title: 'Ayarlar',
      description: 'Sistem ayarları ve entegrasyonlar',
      icon: Settings,
      href: '/crm/ayarlar',
      color: 'from-gray-500 to-slate-500',
      available: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-10 h-10" />
                <h1 className="text-3xl md:text-4xl font-bold">CRM & Proje Yönetim Sistemi</h1>
              </div>
              <p className="text-purple-100">
                Hoş geldiniz, <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Projeler</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <FolderOpen className="w-12 h-12 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gönüllüler</p>
                <p className="text-3xl font-bold text-gray-900">45</p>
              </div>
              <Users className="w-12 h-12 text-purple-500" />
            </div>
          </Card>
          
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Fon</p>
                <p className="text-3xl font-bold text-gray-900">€85K</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplantılar</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <Calendar className="w-12 h-12 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Modüller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.href}
                  className={`overflow-hidden transition-all ${
                    module.available 
                      ? 'hover:shadow-xl cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => module.available && router.push(module.href)}
                >
                  <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {!module.available && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                          Yakında
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {module.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Güvenli Erişim</h3>
              <p className="text-sm text-gray-700">
                Bu sistem sadece yetkili kullanıcılar için şifre korumalıdır. 
                Tüm verileriniz güvenli bir şekilde saklanmaktadır. 
                Sisteme erişim logları tutulmaktadır.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
