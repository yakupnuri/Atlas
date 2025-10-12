'use client'

import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Search, ExternalLink } from 'lucide-react';

export default function MediaLibrary({ isOpen, onClose, onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'unsplash'

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMedia(data.media || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('✅ Resim yüklendi!');
        fetchMedia();
      } else {
        alert('❌ Yükleme hatası!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Yükleme hatası!');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/media?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Görsel silindi!');
        fetchMedia();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Silme hatası!');
    }
  };

  const searchUnsplash = async () => {
    if (!unsplashQuery.trim()) return;

    try {
      // Unsplash API key gerekiyor - şimdilik demo veriler
      const demoImages = [
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
        'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=800',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800'
      ];
      
      setUnsplashResults(demoImages.map((url, i) => ({ id: i, url, alt: unsplashQuery })));
    } catch (error) {
      console.error('Unsplash search error:', error);
    }
  };

  const filteredMedia = media.filter(item =>
    item.originalName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Medya Kütüphanesi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'library'
                  ? 'border-[#05B6C4] text-[#05B6C4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kütüphane
            </button>
            <button
              onClick={() => setActiveTab('unsplash')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'unsplash'
                  ? 'border-[#05B6C4] text-[#05B6C4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Unsplash
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'library' && (
            <>
              {/* Upload & Search */}
              <div className="mb-6 flex gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-[#05B6C4] text-white rounded-lg cursor-pointer hover:bg-[#3B87BE] transition-colors">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Yükleniyor...' : 'Resim Yükle'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Görsellerde ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Media Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
                </div>
              ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => onSelect(item.url)}
                    >
                      <img
                        src={item.url}
                        alt={item.originalName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item.url);
                          }}
                          className="px-4 py-2 bg-[#05B6C4] text-white rounded-lg hover:bg-[#3B87BE] text-sm font-semibold"
                        >
                          Seç
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Henüz görsel yüklenmedi</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'unsplash' && (
            <>
              {/* Unsplash Search */}
              <div className="mb-6 flex gap-4">
                <input
                  type="text"
                  placeholder="Unsplash'ta ara (örn: nature, business)..."
                  value={unsplashQuery}
                  onChange={(e) => setUnsplashQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUnsplash()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                />
                <button
                  onClick={searchUnsplash}
                  className="px-6 py-2 bg-[#05B6C4] text-white rounded-lg hover:bg-[#3B87BE] font-semibold"
                >
                  Ara
                </button>
              </div>

              {/* Unsplash Results */}
              {unsplashResults.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {unsplashResults.map((item) => (
                    <div
                      key={item.id}
                      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => onSelect(item.url)}
                    >
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item.url);
                          }}
                          className="px-4 py-2 bg-[#05B6C4] text-white rounded-lg hover:bg-[#3B87BE] text-sm font-semibold"
                        >
                          Bu Görseli Seç
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Arama yapmak için yukarıdaki kutuyu kullanın</p>
                  <p className="text-sm text-gray-400 mt-2">Demo: "nature", "business", "technology" deneyin</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
