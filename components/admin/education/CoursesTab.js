'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { useEducationData } from '@/hooks/useEducationData';
import { useEducationForm } from '@/hooks/useEducationForm';

export default function CoursesTab() {
  const { data: courses, loading, fetchData, saveData, deleteData } = useEducationData('courses');
  const { formData, updateField, resetForm, handleSubmit, isSubmitting } = useEducationForm({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'beginner',
    schedule: '',
    price: ''
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
      alert(editing ? '✅ Kurs güncellendi!' : '✅ Kurs eklendi!');
      closeModal();
    } else {
      alert('❌ Hata: ' + result.error);
    }
    return result;
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kursu silmek istediğinizden emin misiniz?')) return;
    const result = await deleteData(id);
    if (result.success) {
      alert('✅ Kurs silindi!');
    } else {
      alert('❌ Silme başarısız: ' + result.error);
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelText = (level) => {
    switch(level) {
      case 'beginner': return 'Başlangıç';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return level;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kurslar</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Kurs
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz kurs yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{course.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {getLevelText(course.level)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(course)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              )}
              
              <div className="space-y-2 text-sm text-gray-600">
                {course.instructor && (
                  <p><span className="font-semibold">Öğretmen:</span> {course.instructor}</p>
                )}
                {course.duration && (
                  <p><span className="font-semibold">Süre:</span> {course.duration}</p>
                )}
                {course.schedule && (
                  <p><span className="font-semibold">Program:</span> {course.schedule}</p>
                )}
                {course.price && (
                  <p className="font-bold text-teal-600">Fiyat: {course.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">
                {editing ? 'Kurs Düzenle' : 'Yeni Kurs Ekle'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kurs Adı *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Örn: Türkçe Dil Kursu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                    placeholder="Kurs hakkında detaylı bilgi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Öğretmen</label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => updateField('instructor', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Öğretmen adı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seviye</label>
                    <select
                      value={formData.level}
                      onChange={(e) => updateField('level', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      <option value="beginner">Başlangıç</option>
                      <option value="intermediate">Orta</option>
                      <option value="advanced">İleri</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Örn: 12 hafta"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Örn: €150"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => updateField('schedule', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Örn: Pazartesi & Çarşamba, 18:00-20:00"
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
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
