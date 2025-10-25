'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { useEducationData } from '@/hooks/useEducationData';
import { useEducationForm } from '@/hooks/useEducationForm';

export default function ScheduleTab() {
  const { data: schedule, loading, fetchData, saveData, deleteData } = useEducationData('schedule');
  const { formData, updateField, resetForm, handleSubmit, isSubmitting } = useEducationForm({
    day: 'Pazartesi',
    time: '10:00',
    subject: '',
    instructor: '',
    room: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

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
      alert(editing ? '✅ Program güncellendi!' : '✅ Program eklendi!');
      closeModal();
    } else {
      alert('❌ Hata: ' + result.error);
    }
    return result;
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu programı silmek istediğinizden emin misiniz?')) return;
    const result = await deleteData(id);
    if (result.success) {
      alert('✅ Program silindi!');
    } else {
      alert('❌ Silme başarısız: ' + result.error);
    }
  };

  // Group by day
  const groupedSchedule = days.map(day => ({
    day,
    items: schedule.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time))
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ders Programı</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Ders
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : schedule.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz program yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupedSchedule.map(({ day, items }) => (
            <div key={day} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                {day}
              </h3>
              {items.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Ders yok</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="bg-indigo-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-indigo-600">{item.time}</span>
                            <span className="font-semibold text-gray-900">{item.subject}</span>
                          </div>
                          {item.instructor && (
                            <p className="text-sm text-gray-600">Öğretmen: {item.instructor}</p>
                          )}
                          {item.room && (
                            <p className="text-sm text-gray-600">Oda: {item.room}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openModal(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                {editing ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gün *</label>
                    <select
                      value={formData.day}
                      onChange={(e) => updateField('day', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saat *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateField('time', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ders Adı *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Örn: Türkçe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Öğretmen</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => updateField('instructor', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Öğretmen adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Oda/Sınıf</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => updateField('room', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Oda numarası"
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
                  disabled={isSubmitting || !formData.subject}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
