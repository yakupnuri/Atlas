'use client'

import { useState, useEffect } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import MediaLibrary from '@/components/MediaLibrary'

export default function SeminarModal({ seminar, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    speaker: '',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  useEffect(() => {
    if (seminar) {
      setForm({
        title: seminar.title || '',
        description: seminar.description || '',
        date: seminar.date || '',
        time: seminar.time || '',
        location: seminar.location || '',
        speaker: seminar.speaker || '',
        imageUrl: seminar.imageUrl || ''
      })
    }
  }, [seminar])

  const handleImageSelect = (imageUrl) => {
    setForm({ ...form, imageUrl })
    setShowMediaLibrary(false)
  }

  const handleSave = async () => {
    if (!form.title || !form.date || !form.time) {
      alert('Verplichte velden invullen')
      return
    }

    setLoading(true)
    try {
      const method = seminar ? 'PUT' : 'POST'
      const body = seminar
        ? { type: 'seminars', id: seminar.id, data: form }
        : { type: 'seminars', data: form }

      const response = await fetch('/api/career', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await response.json()
      if (result.success) {
        onSave()
      } else {
        alert('Opslaan mislukt: ' + result.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
        <div className="p-6 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {seminar ? 'Seminar bewerken' : 'Nieuw seminar toevoegen'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seminartitel *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Titel van het seminar"
            />
          </div>

          {/* Image Selection - Media Library */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Afbeelding</label>
            
            {form.imageUrl ? (
              <div className="relative mb-3">
                <img src={form.imageUrl} alt="Geselecteerd" className="w-full h-48 object-cover rounded-lg" />
                <button
                  onClick={() => setForm({ ...form, imageUrl: '' })}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <ImageIcon className="w-12 h-12" />
                <span className="font-semibold">Afbeelding toevoegen</span>
                <span className="text-sm">Klik om afbeelding te kiezen uit mediabibliotheek</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Beschrijving</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Seminarbeschrijving..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Datum *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tijd *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Locatie</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="bijv. Atlas kantoor, Online"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Spreker</label>
            <input
              type="text"
              value={form.speaker}
              onChange={(e) => setForm({ ...form, speaker: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Naam van de spreker"
            />
          </div>
        </div>

        <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onClose={() => setShowMediaLibrary(false)}
          onSelect={handleImageSelect}
        />
      )}
    </div>
  )
}
