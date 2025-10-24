'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
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
  Clock,
  Image as ImageIcon,
  X
} from 'lucide-react';

export default function EducatieAdminPage() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', date: '' });

  // Articles
  const [articles, setArticles] = useState([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({ title: '', excerpt: '', content: '', author: '', date: '', image: '' });

  // Documents
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Sadece PDF dosyaları yükleyebilirsiniz');
      return;
    }

    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.media || !uploadResult.media.url) {
        throw new Error(uploadResult.error || 'File upload failed');
      }

      // Save document metadata
      const docData = {
        title: file.name.replace('.pdf', ''),
        fileName: file.name,
        filePath: uploadResult.media.url,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
      };

      const response = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'documents', data: docData }),
      });

      const result = await response.json();
      if (result.success) {
        alert('PDF başarıyla yüklendi!');
        fetchData();
        e.target.value = ''; // Reset file input
      } else {
        alert('Doküman kaydetme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Dosya yükleme başarısız: ' + error.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  // Delete Document
  const deleteDocument = async (id) => {
    if (!confirm('Bu dokümanı silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/education?type=documents&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        alert('Silme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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

  // Save Announcement
  const saveAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.date) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingAnnouncement ? 'PUT' : 'POST';
      const body = editingAnnouncement
        ? { type: 'announcements', id: editingAnnouncement.id, data: announcementForm }
        : { type: 'announcements', data: announcementForm };

      const response = await fetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowAnnouncementModal(false);
        setAnnouncementForm({ title: '', date: '' });
        setEditingAnnouncement(null);
        fetchData();
      } else {
        alert('Kaydetme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Delete Announcement
  const deleteAnnouncement = async (id) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/education?type=announcements&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        alert('Silme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Save Article
  const saveArticle = async () => {
    if (!articleForm.title || !articleForm.content || !articleForm.author || !articleForm.date) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const body = editingArticle
        ? { type: 'articles', id: editingArticle.id, data: articleForm }
        : { type: 'articles', data: articleForm };

      const response = await fetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowArticleModal(false);
        setArticleForm({ title: '', excerpt: '', content: '', author: '', date: '', image: '' });
        setEditingArticle(null);
        fetchData();
      } else {
        alert('Kaydetme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Delete Article
  const deleteArticle = async (id) => {
    if (!confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/education?type=articles&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        alert('Silme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Save Schedule
  const saveSchedule = async () => {
    if (!scheduleForm.day || !scheduleForm.time || !scheduleForm.subject || !scheduleForm.teacher) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingSchedule ? 'PUT' : 'POST';
      const body = editingSchedule
        ? { type: 'schedule', id: editingSchedule.id, data: scheduleForm }
        : { type: 'schedule', data: scheduleForm };

      const response = await fetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowScheduleModal(false);
        setScheduleForm({ day: 'Maandag', time: '', subject: '', teacher: '' });
        setEditingSchedule(null);
        fetchData();
      } else {
        alert('Kaydetme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Delete Schedule
  const deleteSchedule = async (id) => {
    if (!confirm('Bu dersi silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/education?type=schedule&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        alert('Silme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Save Course
  const saveCourse = async () => {
    if (!courseForm.name || !courseForm.level || !courseForm.description) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingCourse ? 'PUT' : 'POST';
      const body = editingCourse
        ? { type: 'courses', id: editingCourse.id, data: courseForm }
        : { type: 'courses', data: courseForm };

      const response = await fetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowCourseModal(false);
        setCourseForm({ name: '', level: '', description: '', icon: '' });
        setEditingCourse(null);
        fetchData();
      } else {
        alert('Kaydetme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Delete Course
  const deleteCourse = async (id) => {
    if (!confirm('Bu kursu silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/education?type=courses&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        alert('Silme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Save Important Date
  const saveImportantDate = async () => {
    if (!dateForm.title || !dateForm.description || !dateForm.date) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingDate ? 'PUT' : 'POST';
      const body = editingDate
        ? { type: 'calendar', id: editingDate.id, data: dateForm }
        : { type: 'calendar', data: dateForm };

      const response = await fetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowDateModal(false);
        setDateForm({ title: '', description: '', date: '', color: 'blue' });
        setEditingDate(null);
        fetchData();
      } else {
        alert('Kaydetme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Delete Important Date
  const deleteImportantDate = async (id) => {
    if (!confirm('Bu tarihi silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/education?type=calendar&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        alert('Silme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/education?type=${activeTab}`);
      const result = await response.json();
      
      if (result.success) {
        switch (activeTab) {
          case 'announcements':
            setAnnouncements(result.data || []);
            break;
          case 'articles':
            setArticles(result.data || []);
            break;
          case 'documents':
            setDocuments(result.data || []);
            break;
          case 'schedule':
            setSchedule(result.data || []);
            break;
          case 'courses':
            setCourses(result.data || []);
            break;
          case 'calendar':
            setImportantDates(result.data || []);
            break;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
                            const { _id, ...announcementData } = announcement;
                            setAnnouncementForm(announcementData);
                            setShowAnnouncementModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
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
                  onClick={() => {
                    setEditingArticle(null);
                    setArticleForm({ title: '', excerpt: '', content: '', author: '', date: '' });
                    setShowArticleModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Makale
                </button>
              </div>
              {articles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz makale yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{article.excerpt}</p>
                        <p className="text-sm text-gray-500 mt-2">{article.author} • {article.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingArticle(article);
                            const { _id, ...articleData } = article;
                            setArticleForm(articleData);
                            setShowArticleModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dokümanlar & PDF'ler</h2>
                <button
                  onClick={() => document.getElementById('file-upload').click()}
                  disabled={uploadingDoc}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  <Plus className="w-5 h-5" />
                  {uploadingDoc ? 'Yükleniyor...' : 'PDF Yükle'}
                </button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {documents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Download className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz doküman yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Download className="w-8 h-8 text-red-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500">{doc.fileName} • {(doc.fileSize / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ders Programı</h2>
                <button
                  onClick={() => {
                    setEditingSchedule(null);
                    setScheduleForm({ day: 'Maandag', time: '', subject: '', teacher: '' });
                    setShowScheduleModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Ders Ekle
                </button>
              </div>
              {schedule.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz ders programı yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.day} • {item.time}</p>
                        <p className="text-sm text-gray-500 mt-1">Öğretmen: {item.teacher}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingSchedule(item);
                            const { _id, ...scheduleData } = item;
                            setScheduleForm(scheduleData);
                            setShowScheduleModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteSchedule(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kurslar</h2>
                <button
                  onClick={() => {
                    setEditingCourse(null);
                    setCourseForm({ name: '', level: '', description: '', icon: '' });
                    setShowCourseModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Kurs
                </button>
              </div>
              {courses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz kurs yok</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3 flex-1">
                          <div className="text-3xl">{course.icon || '📚'}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{course.name}</h3>
                            <p className="text-sm text-blue-600 mt-1">{course.level}</p>
                            <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCourse(course);
                              setCourseForm(course);
                              setShowCourseModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Önemli Tarihler</h2>
                <button
                  onClick={() => {
                    setEditingDate(null);
                    setDateForm({ title: '', description: '', date: '', color: 'blue' });
                    setShowDateModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Tarih Ekle
                </button>
              </div>
              {importantDates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz önemli tarih yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {importantDates.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start justify-between p-4 border-2 rounded-lg hover:bg-gray-50 ${
                        item.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                        item.color === 'green' ? 'border-green-500 bg-green-50' :
                        item.color === 'purple' ? 'border-purple-500 bg-purple-50' :
                        item.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                        'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <p className="text-sm text-gray-500 mt-2">{item.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingDate(item);
                            const { _id, ...dateData } = item;
                            setDateForm(dateData);
                            setShowDateModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteImportantDate(item.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  onClick={saveAnnouncement}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Article Modal */}
        {showArticleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingArticle ? 'Makale Düzenle' : 'Yeni Makale Ekle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık *</label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Makale başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Özet *</label>
                  <textarea
                    rows="3"
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Kısa özet..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İçerik *</label>
                  <textarea
                    rows="8"
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Makale içeriği..."
                  />
                </div>
                
                {/* Image Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Afbeelding</label>
                  {articleForm.image ? (
                    <div className="relative">
                      <img src={articleForm.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setArticleForm({...articleForm, image: ''})}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <span className="text-sm text-gray-600">Selecteer afbeelding</span>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yazar *</label>
                    <input
                      type="text"
                      value={articleForm.author}
                      onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Yazar adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih *</label>
                    <input
                      type="date"
                      value={articleForm.date}
                      onChange={(e) => setArticleForm({ ...articleForm, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowArticleModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={saveArticle}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingSchedule ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gün *</label>
                  <select
                    value={scheduleForm.day}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Maandag</option>
                    <option>Dinsdag</option>
                    <option>Woensdag</option>
                    <option>Donderdag</option>
                    <option>Vrijdag</option>
                    <option>Zaterdag</option>
                    <option>Zondag</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Saat *</label>
                  <input
                    type="text"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: 18:00-19:30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ders *</label>
                  <input
                    type="text"
                    value={scheduleForm.subject}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ders adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Öğretmen *</label>
                  <input
                    type="text"
                    value={scheduleForm.teacher}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, teacher: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Öğretmen adı"
                  />
                </div>
              </div>
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={saveSchedule}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Modal */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? 'Kurs Düzenle' : 'Yeni Kurs Ekle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kurs Adı *</label>
                  <input
                    type="text"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Turks Taal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Seviye *</label>
                  <input
                    type="text"
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Niveau 1-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama *</label>
                  <textarea
                    rows="4"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Kurs açıklaması..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={courseForm.icon}
                    onChange={(e) => setCourseForm({ ...courseForm, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: 🇹🇷 veya 📚"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={saveCourse}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Important Date Modal */}
        {showDateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingDate ? 'Tarih Düzenle' : 'Yeni Önemli Tarih Ekle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık *</label>
                  <input
                    type="text"
                    value={dateForm.title}
                    onChange={(e) => setDateForm({ ...dateForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Ouderavond"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama *</label>
                  <textarea
                    rows="3"
                    value={dateForm.description}
                    onChange={(e) => setDateForm({ ...dateForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Etkinlik açıklaması..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih *</label>
                  <input
                    type="date"
                    value={dateForm.date}
                    onChange={(e) => setDateForm({ ...dateForm, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Renk *</label>
                  <select
                    value={dateForm.color}
                    onChange={(e) => setDateForm({ ...dateForm, color: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="blue">Mavi</option>
                    <option value="green">Yeşil</option>
                    <option value="purple">Mor</option>
                    <option value="orange">Turuncu</option>
                    <option value="red">Kırmızı</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => setShowDateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={saveImportantDate}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          setArticleForm({...articleForm, image: media.url});
        }}
        allowMultiple={false}
        category="education"
      />
    </AdminLayout>
  );
}
