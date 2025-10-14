'use client'

import { Building, MapPin, ExternalLink } from 'lucide-react'
import ShareButtons from '@/components/ShareButtons'

export default function JobCard({ job, onClick }) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(job)
    }
  }

  return (
    <div 
      className="border-l-4 border-blue-500 bg-gray-50 rounded-r-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors">
          {job.title}
        </h3>
        {job.showInTicker && (
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
            NIEUW
          </span>
        )}
      </div>
      <div className="text-xs text-gray-600 space-y-1 mb-3">
        <div className="flex items-center">
          <Building className="w-3 h-3 mr-1" />
          {job.company}
        </div>
        {job.location && (
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {job.location}
          </div>
        )}
        {job.type && (
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            {job.type}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-700 mb-3 line-clamp-2">{job.description}</p>
    </div>
  )
}
