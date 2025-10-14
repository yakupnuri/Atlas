'use client'

import { Calendar, Clock, MapPin } from 'lucide-react'
import ShareButtons from '@/components/ShareButtons'

const seminarGradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-teal-500',
  'from-indigo-500 to-blue-500'
]

export default function SeminarCard({ seminar, index }) {
  const gradient = seminarGradients[index % seminarGradients.length]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header - Image or Gradient */}
      {seminar.imageUrl ? (
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${seminar.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h3 className="text-2xl font-bold text-white">{seminar.title}</h3>
          </div>
        </div>
      ) : (
        <div className={`h-32 bg-gradient-to-r ${gradient} flex items-center justify-center`}>
          <div className="text-center text-white">
            <Calendar className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{seminar.title}</h3>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 mb-4">{seminar.description}</p>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {seminar.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            {seminar.time}
          </div>
          {seminar.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              {seminar.location}
            </div>
          )}
          {seminar.speaker && (
            <div className="text-sm text-gray-700 mt-2 font-medium">
              Spreker: {seminar.speaker}
            </div>
          )}
        </div>

        {/* Share Button */}
        <div className="flex justify-end border-t pt-4">
          <ShareButtons 
            title={seminar.title}
            description={`${seminar.date} om ${seminar.time}`}
            variant="inline"
          />
        </div>
      </div>
    </div>
  )
}
