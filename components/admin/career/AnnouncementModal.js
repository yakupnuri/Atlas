'use client'

import { useState, useEffect } from 'react'

export default function AnnouncementModal({ announcement, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', content: '', date: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (announcement) {
      setForm({
        title: announcement.title || '',
        content: announcement.content || '',
        date: announcement.date || ''
      })
    }
  }, [announcement])

  const handleSave = async () => {
    if (!form.title || !form.content || !form.date) {
      alert('Lütfen tüm alanları doldurun')
      return
    }

    setLoading(true)
    try {
      const method = announcement ? 'PUT' : 'POST'
      const body = announcement
        ? { type: 'announcements', id: announcement.id, data: form }
        : { type: 'announcements', data: form }

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {announcement ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Duyuru başlığı"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">İçerik *</label>
            <textarea
              rows="5"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Duyuru içeriği..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="p-6 border-t flex gap-3">
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
