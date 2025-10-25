'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Save, 
  Globe,
  Search,
  Tag,
  AlertCircle,
  Key,
  Image,
  Map,
  Cloud,
  CreditCard
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('seo');
  
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  const [integrations, setIntegrations] = useState({
    stripe: {
      publishableKey: '',
      secretKey: '',
      mode: 'test' // 'test' or 'live'
    },
    unsplash: {
      accessKey: '',
      applicationName: ''
    },
    googleMaps: {
      apiKey: ''
    },
    googleDrive: {
      clientId: '',
      clientSecret: '',
      enabled: false
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/homepage');
      const result = await response.json();
      
      if (result.success && result.data) {
        setSeoData(result.data.seo || seoData);
        setIntegrations(result.data.integrations || integrations);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = activeTab === 'seo' 
        ? { type: 'homepage', seo: seoData }
        : { type: 'homepage', integrations: integrations };

      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      if (result.success) {
        alert(activeTab === 'seo' ? 'SEO ayarları kaydedildi!' : 'API entegrasyonları kaydedildi!');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Hata oluştu!');
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
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Ayarlar</h1>
            <p className="text-gray-600 mt-1">Site geneli ayarları yönetin</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-1 p-2">
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'seo'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  SEO Ayarları
                </div>
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'general'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Genel Ayarlar
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* SEO Settings Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">SEO Hakkında</h3>
                <p className="text-sm text-yellow-700">
                  Bu ayarlar ana sayfanın arama motorlarında nasıl görüneceğini belirler. 
                  Gelecekte her sayfa için ayrı SEO ayarları eklenecektir.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Page Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Sayfa Başlığı (Meta Title)
                </label>
                <input
                  type="text"
                  value={seoData.title}
                  onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Stichting Atlas - Samen Bouwen Aan Een Inclusieve Toekomst"
                  maxLength={60}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Arama motorlarında gösterilen ana başlık (önerilen: 50-60 karakter)
                  </p>
                  <span className={`text-xs font-medium ${
                    seoData.title.length > 60 ? 'text-red-600' : 
                    seoData.title.length > 50 ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {seoData.title.length}/60
                  </span>
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4" />
                  Meta Açıklama (Meta Description)
                </label>
                <textarea
                  rows="3"
                  value={seoData.description}
                  onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Een gemeenschap waar culturen samenkomen, kennis wordt gedeeld en iedereen de kans krijgt om te groeien."
                  maxLength={160}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Arama sonuçlarında başlığın altında gösterilen açıklama (önerilen: 150-160 karakter)
                  </p>
                  <span className={`text-xs font-medium ${
                    seoData.description.length > 160 ? 'text-red-600' : 
                    seoData.description.length > 150 ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {seoData.description.length}/160
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Anahtar Kelimeler (Keywords)
                </label>
                <input
                  type="text"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="stichting atlas, community, educatie, cultuur, inclusief"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Virgülle ayrılmış anahtar kelimeler (örn: stichting atlas, community, educatie)
                </p>
              </div>

              {/* Preview */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Google Arama Sonucu Önizlemesi</h3>
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-green-700">stichtingatlas.nl</span>
                  </div>
                  <h4 className="text-lg text-blue-600 hover:underline cursor-pointer mb-1">
                    {seoData.title || 'Sayfa Başlığı'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {seoData.description || 'Meta açıklama burada görünecek...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Yakında Gelecek</h3>
                <p className="text-sm text-blue-700">
                  Genel site ayarları (site adı, logo, sosyal medya linkleri, vb.) yakında eklenecektir.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
