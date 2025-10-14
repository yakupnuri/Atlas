'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react'
import SeminarModal from './SeminarModal'

export default function SeminarsTab({ seminars, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id) => {
    if (!confirm('Bu semineri silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/career?type=seminars&id=${id}`, {
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
        <h2 className="text-2xl font-bold text-gray-900">Seminerler</h2>
        <button
          onClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Yeni Seminer
        </button>
      </div>

      {seminars.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz seminer yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {seminars.map((seminar) => {
            // Check if seminar is expired (past date and time)
            const isExpired = seminar.date && seminar.time && 
              new Date(`${seminar.date}T${seminar.time}`) < new Date()
            
            return (
              <div
                key={seminar.id}
                className={`flex items-start justify-between p-4 border rounded-lg ${
                  isExpired 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{seminar.title}</h3>
                    {isExpired && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                        Gerçekleşti
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{seminar.description}</p>
                  <p className={`text-sm font-medium mt-2 ${isExpired ? 'text-red-600' : 'text-gray-700'}`}>
                    {new Date(seminar.date).toLocaleDateString('tr-TR')} • {seminar.time}
                  </p>
                  {seminar.location && <p className="text-sm text-gray-500 mt-1">📍 {seminar.location}</p>}
                  {seminar.speaker && <p className="text-sm text-gray-500 mt-1">👤 {seminar.speaker}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(seminar)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(seminar.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    disabled={loading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <SeminarModal
          seminar={editing}
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
