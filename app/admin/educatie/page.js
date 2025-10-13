'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Bell,
  Newspaper,
  Download,
  BookOpen,
  Calendar,
  Clock
} from 'lucide-react';

export default function EducatieAdminPage() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [loading, setLoading] = useState(false);
  
  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', date: '' });

  // Articles
  const [articles, setArticles] = useState([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({ title: '', excerpt: '', content: '', author: '', date: '' });

  // Documents
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Schedule
  const [schedule, setSchedule] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ day: 'Maandag', time: '', subject: '', teacher: '' });

  // Courses
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({ name: '', level: '', description: '', icon: '' });

  // Important Dates
  const [importantDates, setImportantDates] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [dateForm, setDateForm] = useState({ title: '', description: '', date: '', color: 'blue' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API calls
      // For now, using demo data
      if (activeTab === 'announcements') {
        setAnnouncements([
          { id: 1, title: 'Nieuwe lessen starten volgende week maandag', date: '2025-01-15' },
          { id: 2, title: 'Ouderavond gepland op 20 januari', date: '2025-01-20' }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'announcements', label: 'Duyurular', icon: Bell },
    { id: 'articles', label: 'Makaleler', icon: Newspaper },
    { id: 'documents', label: 'Dokümanlar', icon: Download },
    { id: 'schedule', label: 'Ders Programı', icon: Clock },
    { id: 'courses', label: 'Kurslar', icon: BookOpen },
    { id: 'calendar', label: 'Takvim', icon: Calendar },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📚 Eğitim Merkezi Yönetimi</h1>
          <p className="text-gray-600 mt-1">Cultuur & Educatiecentrum içeriklerini yönetin</p>
        </div>

        {/* Tabs */}
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

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Duyurular</h2>
                <button
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setAnnouncementForm({ title: '', date: '' });
                    setShowAnnouncementModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Duyuru
                </button>
              </div>

              {announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz duyuru yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <p className="text-sm text-gray-500">{announcement.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAnnouncement(announcement);
                            setAnnouncementForm(announcement);
                            setShowAnnouncementModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Makaleler</h2>
                <button
                  onClick={() => setShowArticleModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Makale
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Henüz makale yok</p>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dokümanlar & PDF'ler</h2>
                <button
                  onClick={() => document.getElementById('file-upload').click()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  PDF Yükle
                </button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    // TODO: Handle file upload
                    console.log('File selected:', e.target.files[0]);
                  }}
                />
              </div>
              <div className="text-center py-12 text-gray-500">
                <Download className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Henüz doküman yok</p>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ders Programı</h2>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Ders Ekle
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Henüz ders programı yok</p>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kurslar</h2>
                <button
                  onClick={() => setShowCourseModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Kurs
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Henüz kurs yok</p>
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Önemli Tarihler</h2>
                <button
                  onClick={() => setShowDateModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Tarih Ekle
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Henüz önemli tarih yok</p>
              </div>
            </div>
          )}
        </div>

        {/* Announcement Modal */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAnnouncement ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duyuru Başlığı *
                  </label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Duyuru başlığını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    value={announcementForm.date}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    // TODO: Save announcement
                    alert('Kaydetme fonksiyonu API bağlantısıyla eklenecek');
                    setShowAnnouncementModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
