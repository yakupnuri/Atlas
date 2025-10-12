'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Save, Database, Key, Globe, Mail, Share2, Search } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('site');
  const [settings, setSettings] = useState({
    site: {
      title: '',
      description: '',
      logo: '',
      favicon: '',
      contact: { email: '', phone: '', address: '' }
    },
    database: { status: '', url: '' },
    apis: {
      stripe: { 
        enabled: false, 
        mode: 'test',
        publishableKey: '', 
        secretKey: '',
        webhookSecret: ''
      },
      unsplash: { enabled: false, accessKey: '' },
      google: { mapsKey: '', analyticsId: '' },
      google_oauth: { enabled: false, client_id: '', client_secret: '', redirect_uri: '' },
      smtp: { host: '', port: 587, user: '', password: '', from: '' }
    },
    social: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
    seo: { metaTitle: '', metaDescription: '', keywords: '' }
  });
  const [stripeKeys, setStripeKeys] = useState({
    enabled: false,
    mode: 'test',
    publishableKey: '',
    secretKey: '',
    webhookSecret: ''
  });
  const [showStripeSecret, setShowStripeSecret] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
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
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('✅ Ayarlar kaydedildi!');
      } else {
        alert('❌ Kaydetme hatası!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'site', label: 'Site Ayarları', icon: Globe },
    { id: 'database', label: 'Veritabanı', icon: Database },
    { id: 'apis', label: 'API Ayarları', icon: Key },
    { id: 'social', label: 'Sosyal Medya', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Search }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
            <p className="text-gray-600">Uygulama ayarlarını yönetin</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#05B6C4] text-[#05B6C4]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Site Ayarları */}
          {activeTab === 'site' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Site Bilgileri</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Başlığı</label>
                  <input
                    type="text"
                    value={settings.site?.title || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { ...settings.site, title: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="text"
                    value={settings.site?.logo || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { ...settings.site, logo: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
                <textarea
                  value={settings.site?.description || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    site: { ...settings.site, description: e.target.value }
                  })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">İletişim Bilgileri</h3>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.site?.contact?.email || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { 
                        ...settings.site, 
                        contact: { ...settings.site.contact, email: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={settings.site?.contact?.phone || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { 
                        ...settings.site, 
                        contact: { ...settings.site.contact, phone: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                  <input
                    type="text"
                    value={settings.site?.contact?.address || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { 
                        ...settings.site, 
                        contact: { ...settings.site.contact, address: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Database Ayarları */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Veritabanı Bilgileri</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Durum:</span>
                  <span className="text-green-600 font-semibold">✓ Bağlı</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">MongoDB URL:</span>
                  <span className="text-gray-600">{settings.database?.url || '✓ Configured'}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Veritabanı ayarları .env dosyasından yönetilir. MONGO_URL değişkenini .env dosyasında güncelleyin.
                </p>
              </div>
            </div>
          )}

          {/* API Ayarları */}
          {activeTab === 'apis' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">API Ayarları</h2>
              
              {/* Google OAuth */}
              <div className="border-2 border-[#05B6C4] rounded-lg p-4 bg-blue-50">
                <h3 className="font-bold text-lg mb-3 text-[#05B6C4]">🔐 Google OAuth (Giriş Sistemi)</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.apis?.google_oauth?.enabled || false}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          google_oauth: { ...settings.apis.google_oauth, enabled: e.target.checked }
                        }
                      })}
                      className="w-5 h-5"
                    />
                    <label className="text-sm font-medium">Google ile Giriş Aktif</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                    <input
                      type="text"
                      value={settings.apis?.google_oauth?.client_id || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          google_oauth: { ...settings.apis.google_oauth, client_id: e.target.value }
                        }
                      })}
                      placeholder="xxxxx.apps.googleusercontent.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                    <input
                      type="password"
                      value={settings.apis?.google_oauth?.client_secret || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          google_oauth: { ...settings.apis.google_oauth, client_secret: e.target.value }
                        }
                      })}
                      placeholder="GOCSPX-xxxxx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URI</label>
                    <input
                      type="text"
                      value={settings.apis?.google_oauth?.redirect_uri || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          google_oauth: { ...settings.apis.google_oauth, redirect_uri: e.target.value }
                        }
                      })}
                      placeholder="https://yourdomain.com/api/auth/callback/google"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none text-sm"
                    />
                  </div>
                  <div className="bg-white border border-blue-200 p-3 rounded-lg text-sm">
                    <p className="text-blue-800">
                      💡 <strong>Not:</strong> Bu bilgileri Google Cloud Console'dan alabilirsiniz. 
                      Değişikliklerden sonra .env dosyasını da güncelleyin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Unsplash */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">Unsplash API</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.apis?.unsplash?.enabled || false}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          unsplash: { ...settings.apis.unsplash, enabled: e.target.checked }
                        }
                      })}
                      className="w-5 h-5"
                    />
                    <label className="text-sm font-medium">Unsplash Entegrasyonunu Aktif Et</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Access Key</label>
                    <input
                      type="text"
                      value={settings.apis?.unsplash?.accessKey || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          unsplash: { ...settings.apis.unsplash, accessKey: e.target.value }
                        }
                      })}
                      placeholder="your_unsplash_access_key"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Google APIs */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">Google Maps & Analytics</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps API Key</label>
                    <input
                      type="text"
                      value={settings.apis?.google?.mapsKey || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          google: { ...settings.apis.google, mapsKey: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                    <input
                      type="text"
                      value={settings.apis?.google?.analyticsId || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          google: { ...settings.apis.google, analyticsId: e.target.value }
                        }
                      })}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SMTP */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">SMTP (Email) Ayarları</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.apis?.smtp?.host || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          smtp: { ...settings.apis.smtp, host: e.target.value }
                        }
                      })}
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                    <input
                      type="number"
                      value={settings.apis?.smtp?.port || 587}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          smtp: { ...settings.apis.smtp, port: parseInt(e.target.value) }
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={settings.apis?.smtp?.user || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          smtp: { ...settings.apis.smtp, user: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                    <input
                      type="password"
                      value={settings.apis?.smtp?.password || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        apis: {
                          ...settings.apis,
                          smtp: { ...settings.apis.smtp, password: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sosyal Medya */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sosyal Medya Linkleri</h2>
              
              <div className="grid grid-cols-2 gap-6">
                {Object.keys(settings.social || {}).map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {platform}
                    </label>
                    <input
                      type="url"
                      value={settings.social[platform] || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        social: { ...settings.social, [platform]: e.target.value }
                      })}
                      placeholder={`https://${platform}.com/...`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Ayarları</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Başlık</label>
                <input
                  type="text"
                  value={settings.seo?.metaTitle || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, metaTitle: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklama</label>
                <textarea
                  value={settings.seo?.metaDescription || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, metaDescription: e.target.value }
                  })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler (virgülle ayırın)</label>
                <input
                  type="text"
                  value={settings.seo?.keywords || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, keywords: e.target.value }
                  })}
                  placeholder="anahtar1, anahtar2, anahtar3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
