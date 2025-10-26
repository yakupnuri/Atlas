'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import {
  Users,
  FileText,
  Calendar,
  Heart,
  TrendingUp,
  Eye,
  MessageSquare,
  FolderKanban,
  Loader2,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    contacts: 0,
    donations: 0,
    donationsTotal: 0,
    surveys: 0,
    projects: 0,
    volunteers: 0,
    loading: true
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all stats in parallel
      const [newsRes, eventsRes, contactsRes, surveysRes, donationsRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/events'),
        fetch('/api/contacts'),
        fetch('/api/surveys'),
        fetch('/api/donations')
      ]);

      const [newsData, eventsData, contactsData, surveysData, donationsData] = await Promise.all([
        newsRes.json(),
        eventsRes.json(),
        contactsRes.json(),
        surveysRes.json(),
        donationsRes.json()
      ]);

      // Calculate total donations
      const totalDonations = (donationsData.donations || [])
        .filter(d => d.status === 'paid')
        .reduce((sum, d) => sum + (d.amount || 0), 0);
      
      const donationCount = (donationsData.donations || [])
        .filter(d => d.status === 'paid')
        .length;

      setStats({
        news: newsData.news?.length || 0,
        events: eventsData.events?.length || 0,
        contacts: contactsData.contacts?.length || 0,
        donations: donationCount,
        donationsTotal: totalDonations,
        surveys: surveysData.surveys?.length || 0,
        projects: 0, // Placeholder
        volunteers: 0, // Placeholder
        loading: false
      });

      // Recent activity (mock data for now)
      setRecentActivity([
        { type: 'news', message: 'Nieuw artikel gepubliceerd', time: '2 uur geleden' },
        { type: 'event', message: 'Nieuw evenement aangemaakt', time: '5 uur geleden' },
        { type: 'contact', message: 'Nieuw contactbericht ontvangen', time: '1 dag geleden' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: 'Nieuws Artikelen',
      value: stats.news,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/admin/nieuws'
    },
    {
      title: 'Evenementen',
      value: stats.events,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: '/admin/evenementen'
    },
    {
      title: 'Contact Berichten',
      value: stats.contacts,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      link: '/admin/contacts'
    },
    {
      title: 'Donaties',
      value: stats.donations,
      subtitle: `€${stats.donationsTotal.toFixed(2)}`,
      icon: Heart,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      link: '/admin/donaties'
    },
    {
      title: 'Actieve Enquêtes',
      value: stats.surveys,
      icon: Activity,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      link: '/admin/surveys'
    },
    {
      title: 'CRM Projecten',
      value: stats.projects,
      icon: FolderKanban,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      link: '/crm/projeler'
    }
  ];

  if (stats.loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overzicht van uw Stichting Atlas applicatie</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <a href={stat.link} className="block">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                      {stat.subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Bekijk alles</span>
                  </div>
                </a>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Snelle Acties</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/nieuws"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Nieuw Artikel</p>
            </a>
            <a
              href="/admin/evenementen"
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Nieuw Evenement</p>
            </a>
            <a
              href="/admin/hero-slides"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Hero Slides</p>
            </a>
            <a
              href="/admin/settings"
              className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
            >
              <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Instellingen</p>
            </a>
          </div>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recente Activiteit</h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'news' ? 'bg-blue-50' :
                      activity.type === 'event' ? 'bg-purple-50' :
                      'bg-green-50'
                    }`}>
                      {activity.type === 'news' && <FileText className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'event' && <Calendar className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'contact' && <MessageSquare className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">Geen recente activiteit</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistieken</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Totaal Bezoekers</span>
                <span className="text-lg font-bold text-gray-900">Coming Soon</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Totaal Donaties</span>
                <span className="text-lg font-bold text-green-600">€ {stats.donationsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Aantal Donaties</span>
                <span className="text-lg font-bold text-gray-900">{stats.donations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Actieve Gebruikers</span>
                <span className="text-lg font-bold text-gray-900">-</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Volledige analytics komen in Fase 2!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
