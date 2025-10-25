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
  CreditCard,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('seo');
  const [showSecrets, setShowSecrets] = useState({});
  
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  const [integrations, setIntegrations] = useState({
    stripe: {
      publishableKey: '',
      secretKey: '',
      mode: 'test'
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
        alert(activeTab === 'seo' ? '✅ SEO ayarları kaydedildi!' : '✅ API entegrasyonları kaydedildi!');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('❌ Hata oluştu!');
    } finally {
      setSaving(false);
    }
  };

  const toggleSecret = (key) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
          <p className="text-gray-600">
            Site SEO ayarları ve API entegrasyonlarını buradan yönetebilirsiniz
          </p>
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
                onClick={() => setActiveTab('integrations')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'integrations'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API & Entegrasyonlar
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
                    Önerilen: 50-60 karakter
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
                  placeholder="Een gemeenschap waar culturen samenkomen..."
                  maxLength={160}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Önerilen: 150-160 karakter
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
                  placeholder="stichting, gemeenschap, cultuur, educatie"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Virgülle ayırarak girin
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">API Entegrasyonları</h3>
                  <p className="text-sm text-blue-700">
                    Uygulama içinde kullanılacak API anahtarlarını buradan yönetebilirsiniz. 
                    Kaydettiğiniz anahtarlar güvenli bir şekilde saklanır.
                  </p>
                </div>
              </div>
            </div>

            {/* Stripe Integration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Stripe (Ödeme Sistemi)</h3>
                  <p className="text-sm text-gray-600">Bağış ve ödeme işlemleri için</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Mode Toggle */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mod</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stripeMode"
                        value="test"
                        checked={integrations.stripe.mode === 'test'}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          stripe: { ...integrations.stripe, mode: e.target.value }
                        })}
                        className="text-blue-600"
                      />
                      <span className="text-sm">Test Mode</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stripeMode"
                        value="live"
                        checked={integrations.stripe.mode === 'live'}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          stripe: { ...integrations.stripe, mode: e.target.value }
                        })}
                        className="text-blue-600"
                      />
                      <span className="text-sm">Live Mode</span>
                    </label>
                  </div>
                </div>

                {/* Publishable Key */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Publishable Key
                  </label>
                  <input
                    type="text"
                    value={integrations.stripe.publishableKey}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      stripe: { ...integrations.stripe, publishableKey: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="pk_test_..."
                  />
                </div>

                {/* Secret Key */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.stripeSecret ? 'text' : 'password'}
                      value={integrations.stripe.secretKey}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        stripe: { ...integrations.stripe, secretKey: e.target.value }
                      })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="sk_test_..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('stripeSecret')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets.stripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Unsplash Integration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Image className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Unsplash (Görsel Kütüphanesi)</h3>
                  <p className="text-sm text-gray-600">Media Library için görsel arama</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Access Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.unsplashKey ? 'text' : 'password'}
                      value={integrations.unsplash.accessKey}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        unsplash: { ...integrations.unsplash, accessKey: e.target.value }
                      })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Your Unsplash Access Key"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('unsplashKey')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets.unsplashKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Application Name (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={integrations.unsplash.applicationName}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      unsplash: { ...integrations.unsplash, applicationName: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Stichting Atlas"
                  />
                </div>
              </div>
            </div>

            {/* Google Maps Integration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Map className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Maps</h3>
                  <p className="text-sm text-gray-600">Konum ve harita özellikleri için</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.mapsKey ? 'text' : 'password'}
                      value={integrations.googleMaps.apiKey}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        googleMaps: { ...integrations.googleMaps, apiKey: e.target.value }
                      })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="AIza..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('mapsKey')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets.mapsKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Drive Integration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Google Drive</h3>
                    <p className="text-sm text-gray-600">Doküman depolama (opsiyonel)</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integrations.googleDrive.enabled}
                    onChange={(e) => setIntegrations({
                      ...integrations,
                      googleDrive: { ...integrations.googleDrive, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {integrations.googleDrive.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={integrations.googleDrive.clientId}
                      onChange={(e) => setIntegrations({
                        ...integrations,
                        googleDrive: { ...integrations.googleDrive, clientId: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Client ID"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Client Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.driveSecret ? 'text' : 'password'}
                        value={integrations.googleDrive.clientSecret}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          googleDrive: { ...integrations.googleDrive, clientSecret: e.target.value }
                        })}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Client Secret"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('driveSecret')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showSecrets.driveSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Kaydet ve Uygula
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Genel Ayarlar
              </h3>
              <p className="text-gray-600">
                Bu bölüm yakında eklenecektir
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
