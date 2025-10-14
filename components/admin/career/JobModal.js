'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: '',
    applyLink: '',
    expiryDate: '',
    showInTicker: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        type: job.type || '',
        description: job.description || '',
        requirements: job.requirements || '',
        applyLink: job.applyLink || '',
        expiryDate: job.expiryDate || '',
        showInTicker: job.showInTicker !== undefined ? job.showInTicker : true
      })
    }
  }, [job])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.company || !form.description) {
      alert('Verplichte velden invullen')
      return
    }

    setLoading(true)
    try {
      const method = job ? 'PUT' : 'POST'
      const body = job
        ? { type: 'jobs', id: job.id, data: form }
        : { type: 'jobs', data: form }

      const response = await fetch('/api/career', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()
      if (result.success) {
        onSave()
      } else {
        alert('Fout: ' + result.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {job ? 'Vacature bewerken' : 'Nieuwe vacature'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Functietitel *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="bijv. Senior Developer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrijf *</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Bedrijfsnaam"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Locatie</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Amsterdam, Nederland"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Fulltime, Parttime, etc."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Functiebeschrijving *</label>
            <textarea
              rows="5"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Beschrijf de functie..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vereisten</label>
            <textarea
              rows="4"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Vereisten en kwalificaties..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sollicitatielink</label>
            <input
              type="url"
              value={form.applyLink}
              onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sluitingsdatum vacature</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Op deze datum wordt de vacature automatisch verwijderd
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showInTicker"
              checked={form.showInTicker}
              onChange={(e) => setForm({ ...form, showInTicker: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showInTicker" className="ml-2 text-sm font-medium text-gray-700">
              Weergeven in nieuwsticker
            </label>
          </div>
        </form>

        <div className="p-6 border-t flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Annuleren
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>
    </div>
  )
}
