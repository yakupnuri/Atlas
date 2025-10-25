'use client'

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import SurveyManager from '@/components/surveys/SurveyManager';
import AnnouncementsTab from '@/components/admin/education/AnnouncementsTab';
import ArticlesTab from '@/components/admin/education/ArticlesTab';
import VideosTab from '@/components/admin/education/VideosTab';
import DocumentsTab from '@/components/admin/education/DocumentsTab';
import ScheduleTab from '@/components/admin/education/ScheduleTab';
import CoursesTab from '@/components/admin/education/CoursesTab';
import CalendarTab from '@/components/admin/education/CalendarTab';
import { 
  Bell,
  Newspaper,
  Download,
  BookOpen,
  Calendar,
  Clock,
  Video
} from 'lucide-react';

export default function EducatieAdminPage() {
  const [activeTab, setActiveTab] = useState('announcements');

  const tabs = [
    { id: 'announcements', label: 'Duyurular', icon: Bell },
    { id: 'articles', label: 'Makaleler', icon: Newspaper },
    { id: 'videos', label: 'Videolar', icon: Video },
    { id: 'documents', label: 'Dokümanlar', icon: Download },
    { id: 'schedule', label: 'Ders Programı', icon: Clock },
    { id: 'courses', label: 'Kurslar', icon: BookOpen },
    { id: 'calendar', label: 'Takvim', icon: Calendar },
    { id: 'surveys', label: 'Anketler', icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📚 Eğitim Merkezi Yönetimi</h1>
          <p className="text-gray-600 mt-1">Cultuur & Educatiecentrum içeriklerini yönetin</p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'announcements' && <AnnouncementsTab />}
          {activeTab === 'articles' && <ArticlesTab />}
          {activeTab === 'videos' && <VideosTab />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'surveys' && <SurveyManager module="education" />}
        </div>
      </div>
    </AdminLayout>
  );
}
