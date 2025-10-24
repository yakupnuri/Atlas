'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, BarChart3, Eye, EyeOff, Calendar } from 'lucide-react'
import SurveyBuilder from './SurveyBuilder'
import SurveyResults from './SurveyResults'

export default function SurveyManager({ module }) {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState(null)
  const [selectedSurvey, setSelectedSurvey] = useState(null)

  useEffect(() => {
    fetchSurveys()
  }, [module])

  const fetchSurveys = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/surveys?module=${module}&includeExpired=true`)
      const result = await response.json()
      if (result.success) {
        setSurveys(result.data)
      }
    } catch (error) {
      console.error('Error fetching surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingSurvey(null)
    setShowBuilder(true)
  }

  const handleEdit = (survey) => {
    setEditingSurvey(survey)
    setShowBuilder(true)
  }

  const handleDelete = async (surveyId) => {
    if (!confirm('Weet u zeker dat u deze enquête wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/surveys?id=${surveyId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        alert('Enquête verwijderd!')
        fetchSurveys()
      }
    } catch (error) {
      console.error('Error deleting survey:', error)
      alert('Fout bij verwijderen')
    }
  }

  const handleToggleActive = async (survey) => {
    try {
      const response = await fetch('/api/surveys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: survey.id,
          isActive: !survey.isActive
        })
      })
      const result = await response.json()
      if (result.success) {
        fetchSurveys()
      }
    } catch (error) {
      console.error('Error toggling survey:', error)
    }
  }

  const handleViewResults = (survey) => {
    setSelectedSurvey(survey)
    setShowResults(true)
  }

  const isExpired = (endDate) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
  }

  const getModuleLabel = (mod) => {
    const labels = {
      career: 'Carrière',
      education: 'Educatie',
      projects: 'Projecten'
    }
    return labels[mod] || mod
  }

  if (showBuilder) {
    return (
      <SurveyBuilder
        survey={editingSurvey}
        module={module}
        onClose={() => {
          setShowBuilder(false)
          setEditingSurvey(null)
        }}
        onSave={() => {
          setShowBuilder(false)
          setEditingSurvey(null)
          fetchSurveys()
        }}
      />
    )
  }

  if (showResults && selectedSurvey) {
    return (
      <SurveyResults
        survey={selectedSurvey}
        onClose={() => {
          setShowResults(false)
          setSelectedSurvey(null)
        }}
      />
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enquêtes</h2>
          <p className="text-sm text-gray-600 mt-1">
            {getModuleLabel(module)} module - Beheer uw enquêtes
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Enquête
        </button>
      </div>

      {/* Survey List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Laden...</p>
        </div>
      ) : surveys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Nog geen enquêtes</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-blue-600 hover:underline"
          >
            Maak uw eerste enquête →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 ${
                isExpired(survey.endDate)
                  ? 'border-gray-300 opacity-75'
                  : survey.isActive
                  ? 'border-green-500'
                  : 'border-gray-300'
              }`}
            >
              {/* Image */}
              {survey.image && (
                <img
                  src={survey.image}
                  alt={survey.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {survey.title}
              </h3>
              {survey.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {survey.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>{survey.questions?.length || 0} vragen</span>
                </div>
                {survey.endDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isExpired(survey.endDate) ? 'Verlopen: ' : 'Eindigt: '}
                      {new Date(survey.endDate).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                {isExpired(survey.endDate) ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    Verlopen
                  </span>
                ) : survey.isActive ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <Eye className="w-3 h-3" />
                    Actief
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    <EyeOff className="w-3 h-3" />
                    Inactief
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewResults(survey)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4" />
                  Resultaten
                </button>
                <button
                  onClick={() => handleEdit(survey)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Bewerken"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleToggleActive(survey)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title={survey.isActive ? 'Deactiveren' : 'Activeren'}
                >
                  {survey.isActive ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(survey.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Verwijderen"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
