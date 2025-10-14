'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ClipboardList } from 'lucide-react'

export default function SurveyModal({ survey, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    endDate: '',
    questions: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (survey) {
      setForm({
        title: survey.title || '',
        description: survey.description || '',
        deadline: survey.deadline || '',
        endDate: survey.endDate || '',
        questions: survey.questions?.map(q => ({
          ...q,
          id: q.id || Date.now().toString() + Math.random()
        })) || []
      })
    }
  }, [survey])

  const handleSave = async () => {
    if (!form.title || form.questions.length === 0) {
      alert('Lütfen başlık ve en az bir soru ekleyin')
      return
    }

    setLoading(true)
    try {
      const method = survey ? 'PUT' : 'POST'
      const body = survey
        ? { type: 'surveys', id: survey.id, data: form }
        : { type: 'surveys', data: form }

      const response = await fetch('/api/career', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await response.json()
      if (result.success) {
        onSave()
      } else {
        alert('Kaydetme başarısız: ' + result.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString() + Math.random(),
      text: '',
      type: 'text',
      options: []
    }
    setForm({
      ...form,
      questions: [...form.questions, newQuestion]
    })
  }

  const updateQuestion = (questionId, field, value) => {
    setForm({
      ...form,
      questions: form.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    })
  }

  const removeQuestion = (questionId) => {
    setForm({
      ...form,
      questions: form.questions.filter(q => q.id !== questionId)
    })
  }

  const addOption = (questionId) => {
    setForm({
      ...form,
      questions: form.questions.map(q =>
        q.id === questionId
          ? { ...q, options: [...(q.options || []), ''] }
          : q
      )
    })
  }

  const updateOption = (questionId, optionIndex, value) => {
    setForm({
      ...form,
      questions: form.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
            }
          : q
      )
    })
  }

  const removeOption = (questionId, optionIndex) => {
    setForm({
      ...form,
      questions: form.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl my-8">
        <div className="p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {survey ? 'Anket Düzenle' : 'Yeni Anket Oluştur'}
          </h2>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Anket Başlığı *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Anket başlığı"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Anket açıklaması..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Son Katılım Tarihi</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Anket Bitiş Tarihi</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu tarihte anket otomatik olarak yayından kaldırılacaktır
            </p>
          </div>

          {/* Questions Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sorular</h3>
              <button
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Soru Ekle
              </button>
            </div>

            {form.questions.map((question, index) => (
              <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold text-gray-700">Soru {index + 1}</span>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Soru metni"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soru Tipi</label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="text">Kısa Metin</option>
                      <option value="textarea">Uzun Metin</option>
                      <option value="multiple-choice">Çoktan Seçmeli</option>
                      <option value="yes-no">Evet/Hayır</option>
                    </select>
                  </div>

                  {question.type === 'multiple-choice' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Seçenekler</label>
                        <button
                          onClick={() => addOption(question.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Seçenek Ekle
                        </button>
                      </div>
                      {question.options?.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={`Seçenek ${optIndex + 1}`}
                          />
                          <button
                            onClick={() => removeOption(question.id, optIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {form.questions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ClipboardList className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Henüz soru eklenmedi. "Soru Ekle" butonuna tıklayın.</p>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
