'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Save, 
  Eye,
  TrendingUp
} from 'lucide-react';

export default function HomepageAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    featuredSections: {
      showNews: true,
      showEvents: true,
      showProjects: true,
      newsCount: 4,
      eventsCount: 3,
      projectsCount: 6
    }
  });

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const response = await fetch('/api/homepage');
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData({
          featuredSections: result.data.featuredSections || formData.featuredSections
        });
      }
    } catch (error) {
      console.error('Error fetching homepage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'homepage',
          featuredSections: formData.featuredSections
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Homepage ayarları başarıyla güncellendi!');
      } else {
        alert('❌ Hata: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('❌ Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏠 Homepage Yönetimi</h1>
            <p className="text-gray-600 mt-1">Öne çıkan bölümleri yönetin</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-5 h-5" />
              Önizle
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Öne Çıkan Bölümler</h3>
              <p className="text-sm text-blue-700">
                Ana sayfada hangi içeriklerin gösterileceğini ve kaç adet gösterileceğini buradan ayarlayabilirsiniz.
              </p>
              <p className="text-sm text-blue-600 mt-2">
                <strong>Not:</strong> Hero slider yönetimi için <a href="/admin/hero-slides" className="underline">Hero Slides</a> sayfasını, 
                SEO ayarları için <a href="/admin/settings" className="underline">Ayarlar</a> sayfasını kullanın.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Sections Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            Öne Çıkan Bölümler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* News Section */}
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featuredSections.showNews}
                    onChange={(e) => setFormData({
                      ...formData,
                      featuredSections: { ...formData.featuredSections, showNews: e.target.checked }
                    })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-900">Haberler</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gösterilecek Haber Sayısı
                </label>
                <input
                  type="number"
                  value={formData.featuredSections.newsCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    featuredSections: { ...formData.featuredSections, newsCount: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="4"
                  min="1"
                  max="12"
                  disabled={!formData.featuredSections.showNews}
                />
                <p className="text-xs text-gray-500 mt-2">En fazla 12 haber gösterilebilir</p>
              </div>
            </div>

            {/* Events Section */}
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featuredSections.showEvents}
                    onChange={(e) => setFormData({
                      ...formData,
                      featuredSections: { ...formData.featuredSections, showEvents: e.target.checked }
                    })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="font-semibold text-gray-900">Etkinlikler</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gösterilecek Etkinlik Sayısı
                </label>
                <input
                  type="number"
                  value={formData.featuredSections.eventsCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    featuredSections: { ...formData.featuredSections, eventsCount: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="3"
                  min="1"
                  max="12"
                  disabled={!formData.featuredSections.showEvents}
                />
                <p className="text-xs text-gray-500 mt-2">En fazla 12 etkinlik gösterilebilir</p>
              </div>
            </div>

            {/* Projects Section */}
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featuredSections.showProjects}
                    onChange={(e) => setFormData({
                      ...formData,
                      featuredSections: { ...formData.featuredSections, showProjects: e.target.checked }
                    })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="font-semibold text-gray-900">Projeler</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gösterilecek Proje Sayısı
                </label>
                <input
                  type="number"
                  value={formData.featuredSections.projectsCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    featuredSections: { ...formData.featuredSections, projectsCount: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="6"
                  min="1"
                  max="12"
                  disabled={!formData.featuredSections.showProjects}
                />
                <p className="text-xs text-gray-500 mt-2">En fazla 12 proje gösterilebilir</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Özet</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">Haberler</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formData.featuredSections.showNews ? formData.featuredSections.newsCount : '—'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium">Etkinlikler</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formData.featuredSections.showEvents ? formData.featuredSections.eventsCount : '—'}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium">Projeler</p>
                <p className="text-2xl font-bold text-green-900">
                  {formData.featuredSections.showProjects ? formData.featuredSections.projectsCount : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
