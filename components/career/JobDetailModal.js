'use client'

import { X, Building, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'
import ShareButtons from '@/components/ShareButtons'

export default function JobDetailModal({ job, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!job) return null

  const handleApply = () => {
    if (job.applyLink) {
      window.open(job.applyLink, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-xl flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Job Type & Expiry */}
          <div className="flex items-center gap-3 flex-wrap">
            {job.type && (
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {job.type}
              </span>
            )}
            {job.expiryDate && (
              <span className="inline-flex items-center gap-1 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                <Calendar className="w-4 h-4" />
                Sluit: {new Date(job.expiryDate).toLocaleDateString('nl-NL')}
              </span>
            )}
            {job.showInTicker && (
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                ⭐ Uitgelicht
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded"></span>
              Functiebeschrijving
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded"></span>
                Vereisten
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Salary */}
          {job.salary && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="text-lg font-bold text-green-900 mb-1">Salaris</h3>
              <p className="text-green-700 font-semibold">{job.salary}</p>
            </div>
          )}

          {/* Social Share */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Delen</h3>
              <ShareButtons 
                title={job.title}
                description={`${job.company} - ${job.location || 'Nederland'}`}
                variant="inline"
              />
            </div>
          </div>
        </div>

        {/* Footer - Apply Button */}
        <div className="sticky bottom-0 bg-gray-50 p-6 border-t rounded-b-xl flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sluiten
            </button>
            {job.applyLink ? (
              <button
                onClick={handleApply}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Solliciteren
                <ExternalLink className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex-1 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold text-center">
                Geen sollicitatielink
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
