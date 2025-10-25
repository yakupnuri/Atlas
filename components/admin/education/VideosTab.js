'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Video as VideoIcon, Play, Image as ImageIcon } from 'lucide-react';
import { useEducationData } from '@/hooks/useEducationData';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useEducationForm } from '@/hooks/useEducationForm';
import MediaLibraryModal from '@/components/MediaLibraryModal';

export default function VideosTab() {
  const { data: videos, loading, fetchData, saveData, deleteData } = useEducationData('videos');
  const { showMediaLibrary, openMediaLibrary, closeMediaLibrary, handleMediaSelect } = useMediaLibrary();
  const { formData, updateField, resetForm, handleSubmit, isSubmitting } = useEducationForm({
    title: '',
    description: '',
    url: '',
    thumbnail: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openVideoModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      resetForm(video);
    } else {
      setEditingVideo(null);
      resetForm();
    }
    setShowModal(true);
  };

  const closeVideoModal = () => {
    setShowModal(false);
    setEditingVideo(null);
    resetForm();
  };

  const onSubmit = async (data) => {
    const videoData = editingVideo ? { ...data, id: editingVideo.id } : data;
    const result = await saveData(videoData, !!editingVideo);
    
    if (result.success) {
      alert(editingVideo ? '✅ Video güncellendi!' : '✅ Video eklendi!');
      closeVideoModal();
    } else {
      alert('❌ Hata: ' + result.error);
    }
    return result;
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu videoyu silmek istediğinizden emin misiniz?')) return;
    
    const result = await deleteData(id);
    if (result.success) {
      alert('✅ Video silindi!');
    } else {
      alert('❌ Silme başarısız: ' + result.error);
    }
  };

  const getThumbnail = (video) => {
    if (video.thumbnail) return video.thumbnail;
    
    // Auto-generate YouTube thumbnail
    if (video.url?.includes('youtube.com') || video.url?.includes('youtu.be')) {
      const videoId = video.url.includes('youtu.be') 
        ? video.url.split('youtu.be/')[1]?.split('?')[0]
        : video.url.split('v=')[1]?.split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Videolar</h2>
        <button
          onClick={() => openVideoModal()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Video
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <VideoIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz video yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-gray-900">
                {getThumbnail(video) ? (
                  <img 
                    src={getThumbnail(video)} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                    <VideoIcon className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openVideoModal(video)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
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

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">
                {editingVideo ? 'Video Düzenle' : 'Yeni Video Ekle'}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Video başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    placeholder="Video hakkında kısa açıklama"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL * (YouTube veya Vimeo)
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => updateField('url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    YouTube otomatik thumbnail oluşturur. Özel thumbnail için aşağıdaki alandan seçebilirsiniz.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özel Thumbnail (Opsiyonel)
                  </label>
                  <div className="flex gap-3 items-center">
                    {formData.thumbnail && (
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail"
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    )}
                    <button
                      onClick={() => openMediaLibrary('thumbnail', (url) => updateField('thumbnail', url))}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                      {formData.thumbnail ? 'Thumbnail Değiştir' : 'Thumbnail Seç'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeVideoModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleSubmit(onSubmit)}
                  disabled={isSubmitting || !formData.title || !formData.url}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Kaydediliyor...' : (editingVideo ? 'Güncelle' : 'Kaydet')}
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
