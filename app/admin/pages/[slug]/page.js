'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import MediaLibrary from '@/components/MediaLibrary';
import { Save, Image as ImageIcon, Eye, X } from 'lucide-react';

export default function PageEditor() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [pageData, setPageData] = useState({
    slug: slug,
    title: '',
    content: '',
    metaDescription: '',
    metaKeywords: '',
    image: '',
    published: true,
  });

  // Page titles mapping
  const pageTitles = {
    'over-ons': 'Over Ons',
    'cultuur-educatie': 'Cultuur Educatie Center',
    'carriere-center': 'Carrière Center',
    'projectgroep': 'Projectgroep',
    'contact': 'Contact',
  };

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages?slug=${slug}`);
      const data = await response.json();
      
      if (data.page) {
        setPageData(data.page);
      } else {
        // Initialize with default title
        setPageData(prev => ({
          ...prev,
          title: pageTitles[slug] || slug,
        }));
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        alert('❌ Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/admin');
        return;
      }

      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        alert('✅ Sayfa başarıyla kaydedildi!');
        fetchPage();
      } else {
        const data = await response.json();
        alert('❌ Hata: ' + (data.error || 'Kaydedilemedi'));
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('❌ Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (imageUrl) => {
    setPageData({ ...pageData, image: imageUrl });
    setShowMediaLibrary(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4] mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {pageTitles[slug] || slug}
            </h1>
            <p className="text-gray-600 mt-2">Sayfa içeriğini düzenleyin</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`/${slug.replace('-', '')}`, '_blank')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-5 h-5" />
              Önizle
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sayfa Başlığı
            </label>
            <input
              type="text"
              value={pageData.title}
              onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
              placeholder="Başlık girin..."
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Öne Çıkan Görsel
            </label>
            <div className="flex items-center gap-4">
              {pageData.image ? (
                <div className="relative">
                  <img
                    src={pageData.image}
                    alt="Preview"
                    className="w-60 h-40 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPageData({ ...pageData, image: '' })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-60 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Görsel Seç
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik
            </label>
            <textarea
              value={pageData.content}
              onChange={(e) => setPageData({ ...pageData, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none font-mono text-sm"
              rows="15"
              placeholder="Sayfa içeriğini buraya yazın..."
            />
            <p className="text-xs text-gray-500 mt-2">
              HTML etiketleri kullanabilirsiniz. Örn: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;
            </p>
          </div>

          {/* SEO Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Ayarları</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama
                </label>
                <textarea
                  value={pageData.metaDescription}
                  onChange={(e) => setPageData({ ...pageData, metaDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  rows="3"
                  placeholder="Sayfa açıklaması (Google'da görünür)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anahtar Kelimeler
                </label>
                <input
                  type="text"
                  value={pageData.metaKeywords}
                  onChange={(e) => setPageData({ ...pageData, metaKeywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  placeholder="anahtar, kelime, virgülle, ayrılmış"
                />
              </div>
            </div>
          </div>

          {/* Published Status */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={pageData.published}
                onChange={(e) => setPageData({ ...pageData, published: e.target.checked })}
                className="w-5 h-5 text-[#05B6C4] rounded"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Yayında (Sayfayı sitede görünür yap)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onSelect={handleImageSelect}
          onClose={() => setShowMediaLibrary(false)}
        />
      )}
    </AdminLayout>
  );
}
