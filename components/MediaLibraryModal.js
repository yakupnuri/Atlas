'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Search, Image as ImageIcon, Loader, Check, Trash2 } from 'lucide-react'

export default function MediaLibraryModal({ isOpen, onClose, onSelect, allowMultiple = false, category = 'all' }) {
  const [activeTab, setActiveTab] = useState('library')
  const [media, setMedia] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [unsplashResults, setUnsplashResults] = useState([])
  const [unsplashQuery, setUnsplashQuery] = useState('nature')
  const [unsplashLoading, setUnsplashLoading] = useState(false)

  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      fetchMedia()
    }
  }, [isOpen, activeTab, selectedCategory])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''
      const response = await fetch(`/api/media?search=${searchQuery}${categoryParam}`)
      const result = await response.json()
      setMedia(result.data || result.media || [])
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files) => {
    setUploading(true)
    try {
      const uploadedMedia = []
      
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name)
        formData.append('category', selectedCategory !== 'all' ? selectedCategory : 'general')
        
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        if (result.success) {
          uploadedMedia.push(result.data)
        }
      }
      
      setMedia([...uploadedMedia, ...media])
      setActiveTab('library')
      alert(`${uploadedMedia.length} dosya yüklendi!`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Yükleme başarısız')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFileUpload(files)
  }

  const searchUnsplash = async () => {
    if (!unsplashQuery.trim()) return
    setUnsplashLoading(true)
    try {
      const response = await fetch(`/api/media/unsplash?query=${encodeURIComponent(unsplashQuery)}`)
      const result = await response.json()
      setUnsplashResults(result.data || [])
    } catch (error) {
      console.error('Unsplash search error:', error)
    } finally {
      setUnsplashLoading(false)
    }
  }

  const importFromUnsplash = async (photo) => {
    try {
      const response = await fetch('/api/media/unsplash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unsplashPhoto: photo })
      })
      const result = await response.json()
      if (result.success) {
        alert('Unsplash foto eklendi!')
        setActiveTab('library')
        fetchMedia()
      }
    } catch (error) {
      console.error('Import error:', error)
    }
  }

  const toggleSelection = (item) => {
    if (allowMultiple) {
      if (selectedMedia.find(m => m.id === item.id)) {
        setSelectedMedia(selectedMedia.filter(m => m.id !== item.id))
      } else {
        setSelectedMedia([...selectedMedia, item])
      }
    } else {
      setSelectedMedia([item])
    }
  }

  const handleInsert = () => {
    console.log('MediaLibrary - handleInsert called');
    console.log('Selected media:', selectedMedia);
    console.log('Allow multiple:', allowMultiple);
    
    if (selectedMedia.length > 0) {
      const dataToSend = allowMultiple ? selectedMedia : selectedMedia[0];
      console.log('Sending to onSelect:', dataToSend);
      onSelect(dataToSend);
      onClose();
      setSelectedMedia([]);
    } else {
      console.warn('No media selected!');
    }
  }

  const deleteMedia = async (id) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return
    try {
      const response = await fetch(`/api/media?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        setMedia(media.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Medya Kütüphanesi</h2>
            <p className="text-sm text-gray-600 mt-1">WordPress tarzı global medya yönetimi</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b bg-gray-50">
          <button onClick={() => setActiveTab('library')} className={`px-6 py-3 font-medium ${activeTab === 'library' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}>
            Kütüphane
          </button>
          <button onClick={() => setActiveTab('upload')} className={`px-6 py-3 font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}>
            Yükle
          </button>
          <button onClick={() => setActiveTab('unsplash')} className={`px-6 py-3 font-medium ${activeTab === 'unsplash' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}>
            Unsplash
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'library' && (
            <div>
              <div className="mb-6 flex gap-4">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-3 border rounded-lg">
                  <option value="all">Tüm Kategoriler</option>
                  <option value="team">Team</option>
                  <option value="news">Nieuws</option>
                  <option value="events">Events</option>
                  <option value="education">Education</option>
                  <option value="career">Career</option>
                  <option value="projects">Projects</option>
                  <option value="hero">Hero Slides</option>
                  <option value="homepage">Homepage</option>
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ara..." className="w-full pl-10 pr-4 py-3 border rounded-lg" />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12"><Loader className="w-12 h-12 animate-spin mx-auto text-blue-600" /></div>
              ) : media.length === 0 ? (
                <div className="text-center py-12"><ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" /><p className="text-gray-600">Henüz görsel yok</p></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <div key={item.id} onClick={() => toggleSelection(item)} className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${selectedMedia.find(m => m.id === item.id) ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                      <img src={item.url || item.path} alt={item.title} className="w-full h-48 object-cover" />
                      {selectedMedia.find(m => m.id === item.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="p-2 bg-white"><p className="text-xs truncate">{item.title}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <div onDragEnter={() => setDragActive(true)} onDragLeave={() => setDragActive(false)} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-12 text-center ${dragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Dosyaları sürükle-bırak</h3>
                <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" id="file-upload" disabled={uploading} />
                <label htmlFor="file-upload" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer">
                  {uploading ? 'Yükleniyor...' : 'Dosya Seç'}
                </label>
              </div>
            </div>
          )}

          {activeTab === 'unsplash' && (
            <div>
              <div className="mb-6 flex gap-2">
                <input type="text" value={unsplashQuery} onChange={(e) => setUnsplashQuery(e.target.value)} placeholder="Unsplash'ta ara..." className="flex-1 px-4 py-3 border rounded-lg" />
                <button onClick={searchUnsplash} disabled={unsplashLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                  {unsplashLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Ara'}
                </button>
              </div>
              {unsplashResults.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {unsplashResults.map((photo) => (
                    <div key={photo.id} className="relative rounded-lg overflow-hidden border">
                      <img src={photo.thumb} alt={photo.alt} className="w-full h-48 object-cover" />
                      <button onClick={() => importFromUnsplash(photo)} className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center text-white">
                        Ekle
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <div className="text-sm text-gray-600">{selectedMedia.length > 0 && <span>{selectedMedia.length} seçili</span>}</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">İptal</button>
            <button onClick={handleInsert} disabled={selectedMedia.length === 0} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {allowMultiple ? `${selectedMedia.length} Görsel Ekle` : 'Seç'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
