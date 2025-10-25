'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bell } from 'lucide-react';
import { useEducationData } from '@/hooks/useEducationData';
import { useEducationForm } from '@/hooks/useEducationForm';

export default function AnnouncementsTab() {
  const { data: announcements, loading, fetchData, saveData, deleteData } = useEducationData('announcements');
  const { formData, updateField, resetForm, handleSubmit, isSubmitting } = useEducationForm({
    title: '',
    date: new Date().toISOString().split('T')[0]
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
      alert(editing ? '✅ Duyuru güncellendi!' : '✅ Duyuru eklendi!');
      closeModal();
    } else {
      alert('❌ Hata: ' + result.error);
    }
    return result;
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;
    const result = await deleteData(id);
    if (result.success) {
      alert('✅ Duyuru silindi!');
    } else {
      alert('❌ Silme başarısız: ' + result.error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Duyurular</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Duyuru
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz duyuru yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:shadow-md transition-shadow flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                {item.date && (
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
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
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">
                {editing ? 'Duyuru Düzenle' : 'Yeni Duyuru'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Duyuru başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
                  disabled={isSubmitting || !formData.title}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
