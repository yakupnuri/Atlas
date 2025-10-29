'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, X, Save, Image as ImageIcon } from 'lucide-react';

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: 'Lees Meer',
    ctaLink: '/',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (slide = null) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        image: slide.image || '',
        ctaText: slide.ctaText || 'Lees Meer',
        ctaLink: slide.ctaLink || '/',
        order: slide.order || 0,
        isActive: slide.isActive !== false
      });
    } else {
      setEditingSlide(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        ctaText: 'Lees Meer',
        ctaLink: '/',
        order: slides.length,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlide(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSlide
        ? `/api/hero-slides?id=${editingSlide.id}`
        : '/api/hero-slides';
      
      const response = await fetch(url, {
        method: editingSlide ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ Opgeslagen!');
        closeModal();
        fetchSlides();
      } else {
        alert('❌ Fout bij opslaan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Fout bij opslaan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Weet je zeker dat je deze slide wilt verwijderen?')) return;
    
    try {
      const response = await fetch(`/api/hero-slides?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Verwijderd!');
        fetchSlides();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Fout bij verwijderen');
    }
  };

  const toggleActive = async (slide) => {
    try {
      const response = await fetch(`/api/hero-slides?id=${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slide, isActive: !slide.isActive })
      });

      if (response.ok) {
        fetchSlides();
      }
    } catch (error) {
      console.error('Error:', error);
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
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Slaytlar</h1>
            <p className="text-gray-600 mt-2">Anasayfa slaytlarını yönetin</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Slayt Ekle
          </button>
        </div>

        {/* Slides List */}
        <div className="grid gap-4">
          {slides.map(slide => (
            <div
              key={slide.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    {slide.image ? (
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Geen afbeelding
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{slide.title}</h3>
                    <div className="flex items-center gap-2">
                      {slide.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          Actief
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                          Inactief
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        Volgorde: {slide.order}
                      </span>
                    </div>
                  </div>
                  
                  {slide.subtitle && (
                    <p className="text-sm text-gray-600 mb-2">{slide.subtitle}</p>
                  )}
                  
                  {slide.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{slide.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs text-gray-500">CTA: {slide.ctaText}</span>
                    <span className="text-xs text-gray-500">→ {slide.ctaLink}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={slide.isActive ? 'Deactiveren' : 'Activeren'}
                  >
                    {slide.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => openModal(slide)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Bewerken"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Verwijderen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {slides.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Nog geen slides. Maak je eerste slide aan!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSlide ? 'Slayt Düzenle' : 'Yeni Slayt Ekle'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  placeholder="Slayt başlığını girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Başlık
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Alt başlık (opsiyonel)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Slayt açıklaması (opsiyonel)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resim
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Manuel URL girebilir veya aşağıdaki butona tıklayabilirsiniz..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMediaLibrary(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-5 h-5" />
                    📸 Medya Kütüphanesinden Resim Seç
                  </button>
                </div>
                {formData.image && (
                  <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Yazısı (CTA)
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Daha Fazla Bilgi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Linki (CTA)
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="/sayfa-adi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıra (Küçük sayı önce gösterilir)
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          setFormData({ ...formData, image: media.url });
          setShowMediaLibrary(false);
        }}
        allowMultiple={false}
        category="hero-slides"
      />
    </AdminLayout>
  );
}
