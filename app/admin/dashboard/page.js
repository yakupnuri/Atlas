'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Users, Calendar, FileText, Newspaper } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const stats = [
    {
      title: 'Toplam Haberler',
      value: '3',
      icon: Newspaper,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Toplam Etkinlikler',
      value: '5',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'ANBI Dokümanlar',
      value: '3',
      icon: FileText,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Takım Üyeleri',
      value: '3',
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Stichting Atlas Admin Paneline Hoş Geldiniz</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/nieuws"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#05B6C4] hover:shadow-md transition-all"
            >
              <Newspaper className="w-6 h-6 text-[#05B6C4] mb-2" />
              <h3 className="font-semibold text-gray-900">Yeni Haber Ekle</h3>
              <p className="text-sm text-gray-600 mt-1">Haber oluştur ve yayınla</p>
            </a>
            <a
              href="/admin/evenementen"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#05B6C4] hover:shadow-md transition-all"
            >
              <Calendar className="w-6 h-6 text-[#05B6C4] mb-2" />
              <h3 className="font-semibold text-gray-900">Yeni Etkinlik Ekle</h3>
              <p className="text-sm text-gray-600 mt-1">Etkinlik planla ve duyur</p>
            </a>
            <a
              href="/admin/about"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#05B6C4] hover:shadow-md transition-all"
            >
              <Users className="w-6 h-6 text-[#05B6C4] mb-2" />
              <h3 className="font-semibold text-gray-900">Over Ons Düzenle</h3>
              <p className="text-sm text-gray-600 mt-1">Kurum bilgilerini güncelle</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
