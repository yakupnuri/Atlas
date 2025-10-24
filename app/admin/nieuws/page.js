'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { Plus, Edit2, Trash2, Eye, Image as ImageIcon, X } from 'lucide-react';

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
    publishDate: new Date().toISOString().split('T')[0],
    commentsEnabled: true
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
        alert('✅ Nieuws succesvol opgeslagen!');
        setShowModal(false);
        setEditingNews(null);
        resetForm();
        fetchNews();
      } else {
        const errorData = await response.json();
        alert('❌ Opslagfout: ' + (errorData.error || 'Onbekende fout'));
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('❌ Opslagfout: ' + error.message);
    }
  };

  const handleDelete = async (newsId) => {
    if (!confirm('Weet u zeker dat u dit nieuwsbericht wilt verwijderen?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Nieuws verwijderd!');
        fetchNews();
      } else {
        alert('❌ Verwijderen mislukt!');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('❌ Verwijderen mislukt!');
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
      publishDate: new Date().toISOString().split('T')[0],
      commentsEnabled: true
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nieuwsbeheer</h1>
            <p className="text-gray-600">{news.length} nieuwsberichten gevonden</p>
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
            Nieuw bericht toevoegen
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
                  <span>{new Date(item.publishDate || item.date).toLocaleDateString('nl-NL')}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/nieuws/${item.slug}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Bekijken
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
                        publishDate: item.publishDate || item.date || new Date().toISOString().split('T')[0],
                        commentsEnabled: item.commentsEnabled !== undefined ? item.commentsEnabled : true
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
            <p className="text-gray-500 text-lg">Nog geen nieuwsberichten toegevoegd</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl my-8">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingNews ? 'Nieuws bewerken' : 'Nieuw bericht toevoegen'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Titel</label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                    placeholder="Titel van het nieuwsbericht"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                    placeholder="url-friendly-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Korte beschrijving</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none resize-none"
                    placeholder="Korte samenvatting..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Inhoud</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none resize-none"
                    placeholder="Volledige inhoud van het nieuwsbericht..."
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Afbeelding</label>
                  
                  {formData.image ? (
                    <div className="relative mb-3">
                      <img src={formData.image} alt="Geselecteerd" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <ImageIcon className="w-12 h-12" />
                      <span className="font-semibold">Afbeelding toevoegen</span>
                      <span className="text-sm">Klik om afbeelding te kiezen uit mediabibliotheek</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                    >
                      <option value="Nieuws">Nieuws</option>
                      <option value="Evenementen">Evenementen</option>
                      <option value="Gemeenschap">Gemeenschap</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publicatiedatum</label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Comments Toggle */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="commentsEnabled"
                    checked={formData.commentsEnabled}
                    onChange={(e) => setFormData({ ...formData, commentsEnabled: e.target.checked })}
                    className="w-5 h-5 text-[#05B6C4] border-gray-300 rounded focus:ring-[#05B6C4]"
                  />
                  <label htmlFor="commentsEnabled" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-900">Reacties inschakelen</div>
                    <div className="text-sm text-gray-600">Sta bezoekers toe om reacties te plaatsen op dit artikel</div>
                  </label>
                </div>
              </form>

              <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-[#05B6C4] text-white rounded-lg hover:bg-[#3B87BE] font-semibold"
                >
                  Opslaan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Library - Only render when needed */}
        {showMediaLibrary && (
          <MediaLibrary
            onClose={() => setShowMediaLibrary(false)}
            onSelect={(url) => {
              setFormData({ ...formData, image: url });
              setShowMediaLibrary(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
