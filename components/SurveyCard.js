'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Calendar, Users, ChevronRight, Clock } from 'lucide-react'

export default function SurveyCard({ survey, onOpen, index = 0 }) {
  const [imageError, setImageError] = useState(false)

  const isExpired = () => {
    if (!survey.endDate) return false
    return new Date(survey.endDate) < new Date()
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      return null
    }
  }

  const expired = isExpired()
  const responseCount = survey.responses?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-500"
    >
      {/* Image */}
      {survey.image && !imageError ? (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          <img
            src={survey.image}
            alt={survey.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          {expired && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Gesloten</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <ClipboardList className="w-20 h-20 text-white opacity-50" />
          {expired && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Gesloten</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Status Badge */}
        <div className="mb-3">
          {expired ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
              Gesloten
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Actief
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {survey.title}
        </h3>

        {/* Description */}
        {survey.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {survey.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClipboardList className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{survey.questions?.length || 0} vragen</span>
          </div>

          {survey.endDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>
                {expired ? 'Gesloten op: ' : 'Sluit op: '}
                <span className="font-medium">{formatDate(survey.endDate)}</span>
              </span>
            </div>
          )}

          {responseCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{responseCount} deelnemers</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {!expired && survey.isActive && (
          <button
            onClick={() => onOpen(survey)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Deelnemen aan enquête</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {expired && (
          <div className="w-full px-6 py-3 bg-gray-100 text-gray-500 rounded-lg text-center font-medium">
            Deze enquête is gesloten
          </div>
        )}
      </div>
    </motion.div>
  )
}
