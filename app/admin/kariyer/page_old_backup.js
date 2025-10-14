'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Plus, 
  Edit2, 
  Trash2,
  Briefcase,
  FileText,
  ClipboardList,
  Calendar,
  Building
} from 'lucide-react';

export default function KariyerAdminPage() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [loading, setLoading] = useState(false);
  
  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', date: '' });

  // Surveys
  const [surveys, setSurveys] = useState([]);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [surveyForm, setSurveyForm] = useState({ 
    title: '', 
    description: '', 
    deadline: '',
    questions: []
  });
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedSurveyResults, setSelectedSurveyResults] = useState(null);

  // Seminars
  const [seminars, setSeminars] = useState([]);
  const [showSeminarModal, setShowSeminarModal] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState(null);
  const [seminarForm, setSeminarForm] = useState({ title: '', description: '', date: '', time: '', location: '', speaker: '' });

  // Jobs
  const [jobs, setJobs] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', type: '', description: '', requirements: '', applyLink: '', showInTicker: true });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/career?type=${activeTab}`);
      const result = await response.json();
      
      if (result.success) {
        switch (activeTab) {
          case 'announcements':
            setAnnouncements(result.data || []);
            break;
          case 'surveys':
            setSurveys(result.data || []);
            break;
          case 'seminars':
            setSeminars(result.data || []);
            break;
          case 'jobs':
            setJobs(result.data || []);
            break;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save Announcement
  const saveAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content || !announcementForm.date) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingAnnouncement ? 'PUT' : 'POST';
      const body = editingAnnouncement
        ? { type: 'announcements', id: editingAnnouncement.id, data: announcementForm }
        : { type: 'announcements', data: announcementForm };

      const response = await fetch('/api/career', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowAnnouncementModal(false);
        setAnnouncementForm({ title: '', content: '', date: '' });
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
      const response = await fetch(`/api/career?type=announcements&id=${id}`, {
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

  // Save Survey
  const saveSurvey = async () => {
    if (!surveyForm.title || surveyForm.questions.length === 0) {
      alert('Lütfen başlık ve en az bir soru ekleyin');
      return;
    }

    setLoading(true);
    try {
      const method = editingSurvey ? 'PUT' : 'POST';
      const body = editingSurvey
        ? { type: 'surveys', id: editingSurvey.id, data: surveyForm }
        : { type: 'surveys', data: surveyForm };

      const response = await fetch('/api/career', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowSurveyModal(false);
        setSurveyForm({ title: '', description: '', deadline: '', questions: [] });
        setEditingSurvey(null);
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

  // Add Question to Survey
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: '',
      type: 'text', // text, multiple-choice, yes-no
      options: []
    };
    setSurveyForm({
      ...surveyForm,
      questions: [...surveyForm.questions, newQuestion]
    });
  };

  // Update Question
  const updateQuestion = (questionId, field, value) => {
    setSurveyForm({
      ...surveyForm,
      questions: surveyForm.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  // Remove Question
  const removeQuestion = (questionId) => {
    setSurveyForm({
      ...surveyForm,
      questions: surveyForm.questions.filter(q => q.id !== questionId)
    });
  };

  // Add Option to Question
  const addOption = (questionId) => {
    setSurveyForm({
      ...surveyForm,
      questions: surveyForm.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: [...(q.options || []), ''] }
          : q
      )
    });
  };

  // Update Option
  const updateOption = (questionId, optionIndex, value) => {
    setSurveyForm({
      ...surveyForm,
      questions: surveyForm.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
            }
          : q
      )
    });
  };

  // Remove Option
  const removeOption = (questionId, optionIndex) => {
    setSurveyForm({
      ...surveyForm,
      questions: surveyForm.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    });
  };

  // View Survey Results
  const viewResults = async (surveyId) => {
    try {
      const response = await fetch(`/api/career/responses?surveyId=${surveyId}`);
      const result = await response.json();
      if (result.success) {
        setSelectedSurveyResults(result.data);
        setShowResultsModal(true);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Sonuçlar yüklenemedi');
    }
  };

  // Delete Survey
  const deleteSurvey = async (id) => {
    if (!confirm('Bu anketi silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/career?type=surveys&id=${id}`, {
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

  // Save Seminar
  const saveSeminar = async () => {
    if (!seminarForm.title || !seminarForm.date || !seminarForm.time) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingSeminar ? 'PUT' : 'POST';
      const body = editingSeminar
        ? { type: 'seminars', id: editingSeminar.id, data: seminarForm }
        : { type: 'seminars', data: seminarForm };

      const response = await fetch('/api/career', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowSeminarModal(false);
        setSeminarForm({ title: '', description: '', date: '', time: '', location: '', speaker: '' });
        setEditingSeminar(null);
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

  // Delete Seminar
  const deleteSeminar = async (id) => {
    if (!confirm('Bu semineri silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/career?type=seminars&id=${id}`, {
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

  // Save Job
  const saveJob = async () => {
    if (!jobForm.title || !jobForm.company || !jobForm.description) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const method = editingJob ? 'PUT' : 'POST';
      const body = editingJob
        ? { type: 'jobs', id: editingJob.id, data: jobForm }
        : { type: 'jobs', data: jobForm };

      const response = await fetch('/api/career', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowJobModal(false);
        setJobForm({ title: '', company: '', location: '', type: '', description: '', requirements: '', applyLink: '', showInTicker: true });
        setEditingJob(null);
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

  // Delete Job
  const deleteJob = async (id) => {
    if (!confirm('Bu iş ilanını silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/career?type=jobs&id=${id}`, {
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

  const tabs = [
    { id: 'announcements', label: 'Duyurular', icon: FileText },
    { id: 'surveys', label: 'Anketler', icon: ClipboardList },
    { id: 'seminars', label: 'Seminerler', icon: Calendar },
    { id: 'jobs', label: 'İş İlanları', icon: Briefcase },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💼 Kariyer Merkezi Yönetimi</h1>
          <p className="text-gray-600 mt-1">İş ilanları, anketler, seminerler ve duyuruları yönetin</p>
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
                    setAnnouncementForm({ title: '', content: '', date: '' });
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
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz duyuru yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{announcement.content?.substring(0, 100)}...</p>
                        <p className="text-sm text-gray-500 mt-2">{announcement.date}</p>
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

          {/* Surveys Tab */}
          {activeTab === 'surveys' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Anketler</h2>
                <button
                  onClick={() => {
                    setEditingSurvey(null);
                    setSurveyForm({ title: '', description: '', deadline: '', questions: [] });
                    setShowSurveyModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Anket
                </button>
              </div>

              {surveys.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz anket yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {surveys.map((survey) => (
                    <div
                      key={survey.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {survey.questions?.length || 0} soru
                        </p>
                        {survey.deadline && <p className="text-sm text-gray-500 mt-1">Son Tarih: {survey.deadline}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewResults(survey.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Sonuçları Görüntüle"
                        >
                          <ClipboardList className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSurvey(survey);
                            setSurveyForm({
                              title: survey.title || '',
                              description: survey.description || '',
                              deadline: survey.deadline || '',
                              questions: survey.questions?.map(q => ({
                                ...q,
                                id: q.id || Date.now().toString() + Math.random()
                              })) || []
                            });
                            setShowSurveyModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteSurvey(survey.id)}
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

          {/* Seminars Tab */}
          {activeTab === 'seminars' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Seminerler</h2>
                <button
                  onClick={() => {
                    setEditingSeminar(null);
                    setSeminarForm({ title: '', description: '', date: '', time: '', location: '', speaker: '' });
                    setShowSeminarModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Seminer
                </button>
              </div>

              {seminars.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz seminer yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {seminars.map((seminar) => (
                    <div
                      key={seminar.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{seminar.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{seminar.description}</p>
                        <p className="text-sm text-gray-700 mt-2">{seminar.date} • {seminar.time}</p>
                        {seminar.location && <p className="text-sm text-gray-500 mt-1">📍 {seminar.location}</p>}
                        {seminar.speaker && <p className="text-sm text-gray-500 mt-1">👤 {seminar.speaker}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingSeminar(seminar);
                            setSeminarForm(seminar);
                            setShowSeminarModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteSeminar(seminar.id)}
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

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">İş İlanları</h2>
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setJobForm({ title: '', company: '', location: '', type: '', description: '', requirements: '', applyLink: '', showInTicker: true });
                    setShowJobModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Yeni İş İlanı
                </button>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz iş ilanı yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          {job.showInTicker && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Ticker'da</span>}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{job.company}</p>
                        <p className="text-sm text-gray-600 mt-1">{job.location} • {job.type}</p>
                        <p className="text-sm text-gray-600 mt-2">{job.description?.substring(0, 100)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setJobForm(job);
                            setShowJobModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
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
        </div>

        {/* Modals */}
        
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık *</label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Duyuru başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İçerik *</label>
                  <textarea
                    rows="5"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Duyuru içeriği..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih *</label>
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

        {/* Survey Modal */}
        {showSurveyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl my-8">
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingSurvey ? 'Anket Düzenle' : 'Yeni Anket Oluştur'}
                </h2>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Anket Başlığı *</label>
                  <input
                    type="text"
                    value={surveyForm.title}
                    onChange={(e) => setSurveyForm({ ...surveyForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Anket başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    rows="3"
                    value={surveyForm.description}
                    onChange={(e) => setSurveyForm({ ...surveyForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Anket açıklaması..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Son Katılım Tarihi</label>
                  <input
                    type="date"
                    value={surveyForm.deadline}
                    onChange={(e) => setSurveyForm({ ...surveyForm, deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Questions Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Sorular</h3>
                    <button
                      onClick={addQuestion}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" />
                      Soru Ekle
                    </button>
                  </div>

                  {surveyForm.questions.map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="font-semibold text-gray-700">Soru {index + 1}</span>
                        <button
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Soru metni"
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Soru Tipi</label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="text">Kısa Metin</option>
                            <option value="textarea">Uzun Metin</option>
                            <option value="multiple-choice">Çoktan Seçmeli</option>
                            <option value="yes-no">Evet/Hayır</option>
                          </select>
                        </div>

                        {question.type === 'multiple-choice' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">Seçenekler</label>
                              <button
                                onClick={() => addOption(question.id)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                + Seçenek Ekle
                              </button>
                            </div>
                            {question.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder={`Seçenek ${optIndex + 1}`}
                                />
                                <button
                                  onClick={() => removeOption(question.id, optIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {surveyForm.questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ClipboardList className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Henüz soru eklenmedi. "Soru Ekle" butonuna tıklayın.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => {
                    setShowSurveyModal(false);
                    setSurveyForm({ title: '', description: '', deadline: '', questions: [] });
                    setEditingSurvey(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={saveSurvey}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Seminar Modal */}
        {showSeminarModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingSeminar ? 'Seminer Düzenle' : 'Yeni Seminer Ekle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Seminer Başlığı *</label>
                  <input
                    type="text"
                    value={seminarForm.title}
                    onChange={(e) => setSeminarForm({ ...seminarForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Seminer başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    rows="4"
                    value={seminarForm.description}
                    onChange={(e) => setSeminarForm({ ...seminarForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Seminer açıklaması..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih *</label>
                    <input
                      type="date"
                      value={seminarForm.date}
                      onChange={(e) => setSeminarForm({ ...seminarForm, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Saat *</label>
                    <input
                      type="time"
                      value={seminarForm.time}
                      onChange={(e) => setSeminarForm({ ...seminarForm, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasyon</label>
                  <input
                    type="text"
                    value={seminarForm.location}
                    onChange={(e) => setSeminarForm({ ...seminarForm, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Atlas Ofisi, Online"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Konuşmacı</label>
                  <input
                    type="text"
                    value={seminarForm.speaker}
                    onChange={(e) => setSeminarForm({ ...seminarForm, speaker: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Konuşmacı adı"
                  />
                </div>
              </div>
              <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowSeminarModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={saveSeminar}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Modal */}
        {showJobModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingJob ? 'İş İlanı Düzenle' : 'Yeni İş İlanı Ekle'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İş Başlığı *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Frontend Developer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Şirket *</label>
                    <input
                      type="text"
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Şirket adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasyon</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Örn: Amsterdam, Remote"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İş Tipi</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Full-time">Tam Zamanlı</option>
                    <option value="Part-time">Yarı Zamanlı</option>
                    <option value="Contract">Sözleşmeli</option>
                    <option value="Internship">Staj</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İş Tanımı *</label>
                  <textarea
                    rows="4"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="İş tanımı ve sorumluluklar..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gereksinimler</label>
                  <textarea
                    rows="3"
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Aranan nitelikler ve gereksinimler..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Başvuru Linki</label>
                  <input
                    type="url"
                    value={jobForm.applyLink}
                    onChange={(e) => setJobForm({ ...jobForm, applyLink: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showInTicker"
                    checked={jobForm.showInTicker}
                    onChange={(e) => setJobForm({ ...jobForm, showInTicker: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showInTicker" className="ml-2 text-sm font-medium text-gray-700">
                    Kayan yazıda göster (Ticker)
                  </label>
                </div>
              </div>
              <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={saveJob}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Survey Results Modal */}
        {showResultsModal && selectedSurveyResults && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Anket Sonuçları</h2>
                  <button
                    onClick={() => {
                      setShowResultsModal(false);
                      setSelectedSurveyResults(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-1">Toplam {selectedSurveyResults.length} katılımcı</p>
              </div>
              <div className="p-6">
                {selectedSurveyResults.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Henüz yanıt yok</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedSurveyResults.map((response, index) => (
                      <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-semibold text-gray-900">Katılımcı {index + 1}</span>
                            <span className="text-sm text-gray-500 ml-3">{response.userName}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(response.submittedAt).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {response.answers.map((answer, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded">
                              <p className="font-medium text-gray-900 mb-1">{answer.question}</p>
                              <p className="text-gray-700">{answer.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
