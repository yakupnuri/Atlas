'use client'

import { motion } from 'framer-motion'
import { FileCheck, Clock } from 'lucide-react'

export default function SurveyCard({ survey, onOpen, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-xl transition-all group cursor-pointer border border-green-100"
      onClick={onOpen}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileCheck className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
            {survey.title}
          </h4>
          {survey.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {survey.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {survey.endDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Sluit: {new Date(survey.endDate).toLocaleDateString('nl-NL')}</span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpen()
          }}
          className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Doe mee
        </button>
      </div>
    </motion.div>
  )
}
