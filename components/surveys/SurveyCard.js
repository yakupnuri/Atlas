'use client'

import { useState } from 'react'
import { FileCheck, Calendar, Clock, ChevronRight } from 'lucide-react'
import SurveyModal from './SurveyModal'

export default function SurveyCard({ survey }) {
  const [showModal, setShowModal] = useState(false)

  const isExpired = () => {
    if (!survey.endDate) return false
    return new Date(survey.endDate) < new Date()
  }

  const daysLeft = () => {
    if (!survey.endDate) return null
    const diff = new Date(survey.endDate) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  if (!survey.isActive || isExpired()) return null

  return (
    <>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-green-100 cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        {survey.image && (
          <img
            src={survey.image}
            alt={survey.title}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        )}

        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
              {survey.title}
            </h3>
            {survey.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {survey.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FileCheck className="w-4 h-4" />
              {survey.questions?.length || 0} vragen
            </span>
            {daysLeft() !== null && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {daysLeft()} dagen
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowModal(true)
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium group-hover:gap-3"
        >
          Doe mee aan enquête
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showModal && (
        <SurveyModal
          survey={survey}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
