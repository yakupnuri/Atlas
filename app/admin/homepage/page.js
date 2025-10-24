'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { 
  Save, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon,
  Eye,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function HomepageAdminPage() {
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('');
  const [heroSlides, setHeroSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [showSlideModal, setShowSlideModal] = useState(false);
  
  const [formData, setFormData] = useState({
    hero: {
      badge: '',
      title: '',
      titleHighlight: '',
      description: '',
      image: '',
      primaryButton: { text: '', link: '' },
      secondaryButton: { text: '', link: '' },
      trustBadges: []
    },
    featuredSections: {
      showNews: true,
      showEvents: true,
      showProjects: true,
      newsCount: 4,
      eventsCount: 3,
      projectsCount: 6
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
  });

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const [homepageRes, slidesRes] = await Promise.all([
        fetch('/api/homepage'),
        fetch('/api/hero-slides')
      ]);
      
      const homepageResult = await homepageRes.json();
      const slidesResult = await slidesRes.json();
      
      if (homepageResult.success && homepageResult.data) {
        setFormData({
          hero: homepageResult.data.hero || formData.hero,
          featuredSections: homepageResult.data.featuredSections || formData.featuredSections,
          seo: homepageResult.data.seo || formData.seo
        });
      }
      
      if (slidesResult.slides) {
        setHeroSlides(slidesResult.slides);
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
          ...formData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Homepage başarıyla güncellendi!');
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

  const addTrustBadge = () => {
    setFormData({
      ...formData,
      hero: {
        ...formData.hero,
        trustBadges: [
          ...formData.hero.trustBadges,
          { text: '', icon: 'CheckCircle' }
        ]
      }
    });
  };

  const updateTrustBadge = (index, text) => {
    const badges = [...formData.hero.trustBadges];
    badges[index].text = text;
    setFormData({
      ...formData,
      hero: { ...formData.hero, trustBadges: badges }
    });
  };

  const removeTrustBadge = (index) => {
    setFormData({
      ...formData,
      hero: {
        ...formData.hero,
        trustBadges: formData.hero.trustBadges.filter((_, i) => i !== index)
      }
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏠 Homepage Yönetimi</h1>
              <p className="text-gray-600 mt-1">Ana sayfa içeriklerini düzenleyin</p>
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

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Hero Bölümü
            </h2>

            <div className="space-y-4">
              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rozet Metni
                </label>
                <input
                  type="text"
                  value={formData.hero.badge}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, badge: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Welkom bij Stichting Atlas"
                />
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Samen Bouwen Aan Een"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vurgulu Başlık (Sarı)
                  </label>
                  <input
                    type="text"
                    value={formData.hero.titleHighlight}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, titleHighlight: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Inclusieve Toekomst"
                  />
                </div>
              </div>

              {/* Description */}
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
                  placeholder="Een gemeenschap waar culturen samenkomen..."
                />
              </div>

              {/* Hero Image */}
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

              {/* Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Birincil Buton</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.hero.primaryButton.text}
                      onChange={(e) => setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          primaryButton: { ...formData.hero.primaryButton, text: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Buton Metni"
                    />
                    <input
                      type="text"
                      value={formData.hero.primaryButton.link}
                      onChange={(e) => setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          primaryButton: { ...formData.hero.primaryButton, link: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="/academie"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">İkincil Buton</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.hero.secondaryButton.text}
                      onChange={(e) => setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          secondaryButton: { ...formData.hero.secondaryButton, text: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Buton Metni"
                    />
                    <input
                      type="text"
                      value={formData.hero.secondaryButton.link}
                      onChange={(e) => setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          secondaryButton: { ...formData.hero.secondaryButton, link: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Güven Rozetleri
                  </label>
                  <button
                    onClick={addTrustBadge}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Rozet Ekle
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.hero.trustBadges.map((badge, index) => (
                    <div key={index} className="flex gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-2" />
                      <input
                        type="text"
                        value={badge.text}
                        onChange={(e) => updateTrustBadge(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="ANBI Erkend"
                      />
                      <button
                        onClick={() => removeTrustBadge(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Sections Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Öne Çıkan Bölümler
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.featuredSections.showNews}
                    onChange={(e) => setFormData({
                      ...formData,
                      featuredSections: { ...formData.featuredSections, showNews: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Haberler Göster</span>
                </label>
                <input
                  type="number"
                  value={formData.featuredSections.newsCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    featuredSections: { ...formData.featuredSections, newsCount: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="4"
                  min="1"
                  max="12"
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.featuredSections.showEvents}
                    onChange={(e) => setFormData({
                      ...formData,
                      featuredSections: { ...formData.featuredSections, showEvents: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Etkinlikler Göster</span>
                </label>
                <input
                  type="number"
                  value={formData.featuredSections.eventsCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    featuredSections: { ...formData.featuredSections, eventsCount: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="3"
                  min="1"
                  max="12"
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.featuredSections.showProjects}
                    onChange={(e) => setFormData({
                      ...formData,
                      featuredSections: { ...formData.featuredSections, showProjects: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Projeler Göster</span>
                </label>
                <input
                  type="number"
                  value={formData.featuredSections.projectsCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    featuredSections: { ...formData.featuredSections, projectsCount: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="6"
                  min="1"
                  max="12"
                />
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
                  placeholder="Stichting Atlas - Samen Bouwen..."
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
                  placeholder="Een gemeenschap waar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anahtar Kelimeler (virgülle ayrılmış)
                </label>
                <input
                  type="text"
                  value={formData.seo.keywords}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, keywords: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="stichting atlas, community, educatie"
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
          category="homepage"
        />
      )}
    </AdminLayout>
  );
}
