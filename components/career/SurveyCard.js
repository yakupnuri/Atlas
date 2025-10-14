'use client'

import { ChevronRight } from 'lucide-react'
import ShareButtons from '@/components/ShareButtons'

const surveyColors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-pink-50', 'bg-yellow-50']
const surveyBorderColors = ['border-blue-200', 'border-green-200', 'border-purple-200', 'border-pink-200', 'border-yellow-200']
const surveyTextColors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-pink-600', 'text-yellow-600']

export default function SurveyCard({ survey, index, onOpen }) {
  const bgColor = surveyColors[index % surveyColors.length]
  const borderColor = surveyBorderColors[index % surveyBorderColors.length]
  const textColor = surveyTextColors[index % surveyTextColors.length]

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border-2 ${borderColor}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{survey.title}</h3>
      <p className="text-gray-700 mb-4">{survey.description}</p>
      <p className="text-sm text-gray-600 mb-2">{survey.questions?.length || 0} vragen</p>
      {survey.deadline && (
        <p className="text-sm text-red-600 mb-4">Deadline: {survey.deadline}</p>
      )}
      
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={onOpen}
          className={`inline-flex items-center ${textColor} font-semibold hover:underline`}
        >
          Deelnemen
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
        <ShareButtons 
          title={survey.title}
          description={`Enquête met ${survey.questions?.length || 0} vragen`}
          variant="inline"
        />
      </div>
    </div>
  )
}
