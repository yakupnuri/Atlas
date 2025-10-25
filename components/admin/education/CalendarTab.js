'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useEducationData } from '@/hooks/useEducationData';
import { useEducationForm } from '@/hooks/useEducationForm';

export default function CalendarTab() {
  const { data: events, loading, fetchData, saveData, deleteData } = useEducationData('calendar');
  const { formData, updateField, resetForm, handleSubmit, isSubmitting } = useEducationForm({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'event',
    description: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (item = null) => {
    if (item) {
      setEditing(item);
      resetForm(item);
    } else {
      setEditing(null);
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    resetForm();
  };

  const onSubmit = async (data) => {
    const itemData = editing ? { ...data, id: editing.id } : data;
    const result = await saveData(itemData, !!editing);
    
    if (result.success) {
      alert(editing ? '✅ Etkinlik güncellendi!' : '✅ Etkinlik eklendi!');
      closeModal();
    } else {
      alert('❌ Hata: ' + result.error);
    }
    return result;
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
    const result = await deleteData(id);
    if (result.success) {
      alert('✅ Etkinlik silindi!');
    } else {
      alert('❌ Silme başarısız: ' + result.error);
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'holiday': return 'bg-red-100 text-red-700 border-red-300';
      case 'exam': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'event': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'registration': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'holiday': return 'Tatil';
      case 'exam': return 'Sınav';
      case 'event': return 'Etkinlik';
      case 'registration': return 'Kayıt';
      default: return type;
    }
  };

  // Sort by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Takvim & Önemli Tarihler</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Tarih
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz önemli tarih yok</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <div key={event.id} className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${getTypeColor(event.type)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-bold text-lg">{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold">
                      {getTypeText(event.type)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-700">{event.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(event)}
                    className="p-2 text-blue-600 hover:bg-white rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-600 hover:bg-white rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">
                {editing ? 'Tarih Düzenle' : 'Yeni Tarih Ekle'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="Örn: Yaz Tatili Başlangıcı"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarih *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tip *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateField('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    >
                      <option value="event">Etkinlik</option>
                      <option value="holiday">Tatil</option>
                      <option value="exam">Sınav</option>
                      <option value="registration">Kayıt</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                    placeholder="İsteğe bağlı açıklama"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleSubmit(onSubmit)}
                  disabled={isSubmitting || !formData.title || !formData.date}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Kaydediliyor...' : (editing ? 'Güncelle' : 'Kaydet')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
