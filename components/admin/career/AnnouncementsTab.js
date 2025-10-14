'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, FileText } from 'lucide-react'
import AnnouncementModal from './AnnouncementModal'

export default function AnnouncementsTab({ announcements, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/career?type=announcements&id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.success) {
        onRefresh()
      } else {
        alert('Silme başarısız: ' + result.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Duyurular</h2>
        <button
          onClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Yeni Duyuru
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz duyuru yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{announcement.content?.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500 mt-2">{announcement.date}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(announcement)
                    setShowModal(true)
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  disabled={loading}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AnnouncementModal
          announcement={editing}
          onClose={() => {
            setShowModal(false)
            setEditing(null)
          }}
          onSave={() => {
            setShowModal(false)
            setEditing(null)
            onRefresh()
          }}
        />
      )}
    </div>
  )
}
