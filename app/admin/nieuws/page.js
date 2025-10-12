'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import MediaLibrary from '@/components/MediaLibrary';
import { Plus, Edit2, Trash2, Eye, Image as ImageIcon } from 'lucide-react';

export default function NewsManagement() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'Nieuws',
    publishDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchNews();
  }, [router]);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = '/api/news';
      const method = editingNews ? 'PUT' : 'POST';
      
      const payload = editingNews 
        ? { ...formData, id: editingNews.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('✅ Haber başarıyla kaydedildi!');
        setShowModal(false);
        setEditingNews(null);
        resetForm();
        fetchNews();
      } else {
        const errorData = await response.json();
        alert('❌ Kaydetme hatası: ' + (errorData.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('❌ Kaydetme hatası: ' + error.message);
    }
  };

  const handleDelete = async (newsId) => {
    if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Haber silindi!');
        fetchNews();
      } else {
        alert('❌ Silme hatası!');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('❌ Silme hatası!');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      category: 'Nieuws',
      publishDate: new Date().toISOString().split('T')[0]
    });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Haber Yönetimi</h1>
            <p className="text-gray-600">{news.length} haber bulundu</p>
          </div>
          <button
            onClick={() => {
              setEditingNews(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Haber Ekle
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#05B6C4] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{new Date(item.publishDate || item.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/nieuws/${item.slug}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Görüntüle
                  </button>
                  <button
                    onClick={() => {
                      setEditingNews(item);
                      setFormData({
                        title: item.title,
                        slug: item.slug,
                        excerpt: item.excerpt,
                        content: item.content,
                        image: item.image || '',
                        category: item.category || 'Nieuws',
                        publishDate: item.publishDate || item.date || new Date().toISOString().split('T')[0]
                      });
                      setShowModal(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz haber eklenmedi</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      });
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özet</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resim</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://... veya medya kütüphanesinden seçin"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Medya Seç
                    </button>
                  </div>
                  {formData.image && (
                    <div className="mt-3">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                    >
                      <option value="Nieuws">Nieuws</option>
                      <option value="Etkinlik">Etkinlik</option>
                      <option value="Eğitim">Eğitim</option>
                      <option value="Kültür">Kültür</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yayın Tarihi</label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingNews(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#05B6C4] text-white rounded-lg hover:bg-[#3B87BE] font-medium"
                  >
                    {editingNews ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
