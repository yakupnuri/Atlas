'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import MediaLibrary from '@/components/MediaLibrary';
import { Calendar, MapPin, Clock, Users, Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    allDay: false,
    location: '',
    address: '',
    category: 'cultureel',
    maxParticipants: '',
    price: '',
    image: '',
    featured: false,
    registrationRequired: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        alert('❌ Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/admin');
        return;
      }

      // Generate slug from title if not provided
      if (!formData.slug && formData.title) {
        formData.slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const url = '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingEvent ? { ...formData, id: editingEvent.id } : formData)
      });

      if (response.ok) {
        alert('✅ Etkinlik başarıyla kaydedildi!');
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
          title: '',
          slug: '',
          description: '',
          date: '',
          startTime: '',
          endTime: '',
          allDay: false,
          location: '',
          address: '',
          category: 'cultureel',
          maxParticipants: '',
          price: '',
          image: '',
          featured: false,
          registrationRequired: true,
        });
        fetchEvents();
      } else {
        const data = await response.json();
        alert('❌ Hata: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('❌ Kaydetme hatası: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      slug: event.slug || '',
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      allDay: event.allDay || false,
      location: event.location || '',
      address: event.address || '',
      category: event.category || 'cultureel',
      maxParticipants: event.maxParticipants || '',
      price: event.price || '',
      image: event.image || '',
      featured: event.featured || false,
      registrationRequired: event.registrationRequired !== false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ Etkinlik silindi!');
        fetchEvents();
      } else {
        alert('❌ Silme hatası!');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('❌ Silme hatası!');
    }
  };

  const handleImageSelect = (imageUrl) => {
    setFormData({ ...formData, image: imageUrl });
    setShowMediaLibrary(false);
  };

  const categories = [
    { value: 'cultureel', label: 'Cultureel' },
    { value: 'educatief', label: 'Educatief' },
    { value: 'sport', label: 'Sport' },
    { value: 'muziek', label: 'Muziek' },
    { value: 'kunst', label: 'Kunst' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'festival', label: 'Festival' },
    { value: 'overig', label: 'Overig' },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Etkinlikler Yönetimi</h1>
            <p className="text-gray-600 mt-2">Etkinlikleri oluşturun, düzenleyin ve yönetin</p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setFormData({
                title: '',
                slug: '',
                description: '',
                date: '',
                startTime: '',
                endTime: '',
                allDay: false,
                location: '',
                address: '',
                category: 'cultureel',
                maxParticipants: '',
                price: '',
                image: '',
                featured: false,
                registrationRequired: true,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            Yeni Etkinlik Ekle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Etkinlik</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{events.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-[#05B6C4] opacity-20" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Yaklaşan</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {events.filter(e => new Date(e.date) >= new Date()).length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Öne Çıkanlar</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {events.filter(e => e.featured).length}
                </p>
              </div>
              <ImageIcon className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Geçmiş</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {events.filter(e => new Date(e.date) < new Date()).length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-gray-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etkinlik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih & Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Henüz etkinlik eklenmemiş</p>
                      <p className="text-sm mt-2">Yeni etkinlik eklemek için yukarıdaki butona tıklayın</p>
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {event.image ? (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.slug}</p>
                            {event.featured && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                                Öne Çıkan
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium">
                            {new Date(event.date).toLocaleDateString('nl-NL')}
                          </p>
                          <p className="text-gray-500">{event.time || 'Tüm gün'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{event.location}</p>
                          <p className="text-gray-500 text-xs">{event.address}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full capitalize">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(event.date) >= new Date() ? (
                          <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                            Yaklaşan
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                            Geçmiş
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Preview & Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etkinlik Görseli
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-40 h-40 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etkinlik Başlığı *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Örn: Kültürel Buluşma Festivali"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL (Slug)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Otomatik oluşturulur"
                    />
                    <p className="text-xs text-gray-500 mt-1">Boş bırakırsanız başlıktan otomatik oluşturulur</p>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      rows="4"
                      placeholder="Etkinlik hakkında detaylı bilgi..."
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saat
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konum *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Örn: Stichting Atlas Merkezi"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Örn: Amsterdam, Nederland"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Max Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maksimum Katılımcı
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Sınırsız"
                      min="0"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat (€)
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Örn: Gratis veya 10"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-[#05B6C4] rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Öne Çıkan Etkinlik (Ana sayfada gösterilir)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="registrationRequired"
                      checked={formData.registrationRequired}
                      onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })}
                      className="w-5 h-5 text-[#05B6C4] rounded"
                    />
                    <label htmlFor="registrationRequired" className="text-sm font-medium text-gray-700">
                      Kayıt Gerekli
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    {editingEvent ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Media Library Modal */}
        {showMediaLibrary && (
          <MediaLibrary
            onSelect={handleImageSelect}
            onClose={() => setShowMediaLibrary(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
