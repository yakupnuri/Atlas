'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react'
import JobModal from './JobModal'

export default function JobsTab({ jobs, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id) => {
    if (!confirm('Bu iş ilanını silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/career?type=jobs&id=${id}`, {
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
        <h2 className="text-2xl font-bold text-gray-900">İş İlanları</h2>
        <button
          onClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Yeni İş İlanı
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz iş ilanı yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            // Check if job is expired
            const isExpired = job.expiryDate && new Date(job.expiryDate) < new Date()
            
            return (
              <div
                key={job.id}
                className={`flex items-start justify-between p-4 border rounded-lg ${
                  isExpired 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    {isExpired && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                        Süresi Dolmuş
                      </span>
                    )}
                    {job.showInTicker && !isExpired && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                        Ticker'da
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{job.company}</p>
                  <p className="text-sm text-gray-600 mt-1">{job.location} • {job.type}</p>
                  {job.expiryDate && (
                    <p className={`text-xs mt-1 ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                      Bitiş: {new Date(job.expiryDate).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{job.description?.substring(0, 100)}...</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(job)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
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
        <JobModal
          job={editing}
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
