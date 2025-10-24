'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { 
  Save, 
  Image as ImageIcon, 
  Eye,
  GraduationCap,
  Plus,
  Trash2
} from 'lucide-react';

export default function AcademieAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('');
  
  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      image: ''
    },
    introduction: {
      title: '',
      content: '',
      features: []
    },
    stats: [],
    cta: {
      title: '',
      description: '',
      primaryButton: { text: '', link: '' },
      secondaryButton: { text: '', link: '' }
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
  });

  useEffect(() => {
    fetchAcademieContent();
  }, []);

  const fetchAcademieContent = async () => {
    try {
      const response = await fetch('/api/academie');
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData({
          hero: result.data.hero || formData.hero,
          introduction: result.data.introduction || formData.introduction,
          stats: result.data.stats || [],
          cta: result.data.cta || formData.cta,
          seo: result.data.seo || formData.seo
        });
      }
    } catch (error) {
      console.error('Error fetching academie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/academie', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'academie',
          ...formData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Atlas Academie başarıyla güncellendi!');
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

  const handleImageSelect = (imageUrl) => {
    if (mediaTarget === 'hero') {
      setFormData({
        ...formData,
        hero: { ...formData.hero, image: imageUrl }
      });
    }
    setShowMediaLibrary(false);
    setMediaTarget('');
  };

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [
        ...formData.stats,
        { id: `stat_${Date.now()}`, label: '', value: '' }
      ]
    });
  };

  const updateStat = (index, field, value) => {
    const stats = [...formData.stats];
    stats[index][field] = value;
    setFormData({ ...formData, stats });
  };

  const removeStat = (index) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index)
    });
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
            <h1 className="text-3xl font-bold text-gray-900">🎓 Atlas Academie Yönetimi</h1>
            <p className="text-gray-600 mt-1">Akademi ana sayfa içeriklerini düzenleyin</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/academie"
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

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              Hero Bölümü
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Başlık
                </label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Atlas Academie"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Başlık
                </label>
                <input
                  type="text"
                  value={formData.hero.subtitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ontdek, Leer en Groei"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  rows="3"
                  value={formData.hero.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Welkom bij Atlas Academie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arka Plan Görseli
                </label>
                <div className="flex gap-3">
                  {formData.hero.image && (
                    <img
                      src={formData.hero.image}
                      alt="Hero"
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => {
                      setMediaTarget('hero');
                      setShowMediaLibrary(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Görsel Seç
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Introduction Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Giriş Bölümü
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.introduction.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    introduction: { ...formData.introduction, title: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Wat is Atlas Academie?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik
                </label>
                <textarea
                  rows="4"
                  value={formData.introduction.content}
                  onChange={(e) => setFormData({
                    ...formData,
                    introduction: { ...formData.introduction, content: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                  placeholder="Atlas Academie is..."
                />
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <strong>Not:</strong> Alt modül özellikleri (Cultuur & Educatie, Carrièrecentrum, Projectgroep) 
                otomatik olarak sistemden çekilmektedir ve burada düzenleme gerektirmez.
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                İstatistikler
              </h2>
              <button
                onClick={addStat}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                İstatistik Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.stats.map((stat, index) => (
                <div key={stat.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">İstatistik {index + 1}</span>
                    <button
                      onClick={() => removeStat(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold"
                      placeholder="50+"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Cursussen"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Call-to-Action
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.cta.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    cta: { ...formData.cta, title: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Klaar om te Beginnen?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={formData.cta.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    cta: { ...formData.cta, description: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Word onderdeel van onze gemeenschap..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Birincil Buton</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.cta.primaryButton.text}
                      onChange={(e) => setFormData({
                        ...formData,
                        cta: {
                          ...formData.cta,
                          primaryButton: { ...formData.cta.primaryButton, text: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Buton Metni"
                    />
                    <input
                      type="text"
                      value={formData.cta.primaryButton.link}
                      onChange={(e) => setFormData({
                        ...formData,
                        cta: {
                          ...formData.cta,
                          primaryButton: { ...formData.cta.primaryButton, link: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="/academie/cultuur-educatie"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">İkincil Buton</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.cta.secondaryButton.text}
                      onChange={(e) => setFormData({
                        ...formData,
                        cta: {
                          ...formData.cta,
                          secondaryButton: { ...formData.cta.secondaryButton, text: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Buton Metni"
                    />
                    <input
                      type="text"
                      value={formData.cta.secondaryButton.link}
                      onChange={(e) => setFormData({
                        ...formData,
                        cta: {
                          ...formData.cta,
                          secondaryButton: { ...formData.cta.secondaryButton, link: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              SEO Ayarları
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sayfa Başlığı (Title)
                </label>
                <input
                  type="text"
                  value={formData.seo.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, title: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Atlas Academie - Educatie, Carrière & Projecten"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama
                </label>
                <textarea
                  rows="2"
                  value={formData.seo.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, description: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                  placeholder="Ontdek Atlas Academie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anahtar Kelimeler
                </label>
                <input
                  type="text"
                  value={formData.seo.keywords}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, keywords: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="atlas academie, educatie, carrière"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibraryModal
          onSelect={handleImageSelect}
          onClose={() => {
            setShowMediaLibrary(false);
            setMediaTarget('');
          }}
          category="academie"
        />
      )}
    </AdminLayout>
  );
}
