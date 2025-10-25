'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Newspaper, Image as ImageIcon } from 'lucide-react';
import { useEducationData } from '@/hooks/useEducationData';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useEducationForm } from '@/hooks/useEducationForm';
import MediaLibraryModal from '@/components/MediaLibraryModal';

export default function ArticlesTab() {
  const { data: articles, loading, fetchData, saveData, deleteData } = useEducationData('articles');
  const { showMediaLibrary, openMediaLibrary, closeMediaLibrary, handleMediaSelect } = useMediaLibrary();
  const { formData, updateField, resetForm, handleSubmit, isSubmitting } = useEducationForm({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    image: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openArticleModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      resetForm(article);
    } else {
      setEditingArticle(null);
      resetForm();
    }
    setShowModal(true);
  };

  const closeArticleModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    resetForm();
  };

  const onSubmit = async (data) => {
    const articleData = editingArticle ? { ...data, id: editingArticle.id } : data;
    const result = await saveData(articleData, !!editingArticle);
    
    if (result.success) {
      alert(editingArticle ? '✅ Makale güncellendi!' : '✅ Makale eklendi!');
      closeArticleModal();
    } else {
      alert('❌ Hata: ' + result.error);
    }
    return result;
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) return;
    
    const result = await deleteData(id);
    if (result.success) {
      alert('✅ Makale silindi!');
    } else {
      alert('❌ Silme başarısız: ' + result.error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Makaleler</h2>
        <button
          onClick={() => openArticleModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Makale
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz makale yok</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {article.author && <span>Yazar: {article.author}</span>}
                    {article.date && <span>{new Date(article.date).toLocaleDateString('tr-TR')}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openArticleModal(article)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">
                {editingArticle ? 'Makale Düzenle' : 'Yeni Makale Ekle'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Makale başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özet
                  </label>
                  <textarea
                    rows="2"
                    value={formData.excerpt}
                    onChange={(e) => updateField('excerpt', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Kısa özet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik *
                  </label>
                  <textarea
                    rows="6"
                    value={formData.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Makale içeriği"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yazar
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => updateField('author', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Yazar adı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kapak Görseli
                  </label>
                  <div className="flex gap-3 items-center">
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Kapak"
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    )}
                    <button
                      onClick={() => openMediaLibrary('article', (url) => updateField('image', url))}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                      {formData.image ? 'Görsel Değiştir' : 'Görsel Seç'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeArticleModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleSubmit(onSubmit)}
                  disabled={isSubmitting || !formData.title || !formData.content}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Kaydediliyor...' : (editingArticle ? 'Güncelle' : 'Kaydet')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onSelect={handleMediaSelect}
          onClose={closeMediaLibrary}
          category="education"
        />
      )}
    </div>
  );
}
