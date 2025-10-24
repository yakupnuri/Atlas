'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import SurveyManager from '@/components/surveys/SurveyManager'

export default function SurveysTab({ surveys, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [surveyResponses, setSurveyResponses] = useState([])

  const handleDelete = async (id) => {
    if (!confirm('Bu anketi silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/career?type=surveys&id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.success) {
        onRefresh()
      } else {
        alert('Silme başarısız: ' + result.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const viewResults = async (surveyId) => {
    try {
      const response = await fetch(`/api/career/responses?surveyId=${surveyId}`)
      const result = await response.json()
      if (result.success) {
        setSelectedSurvey(surveys.find(s => s.id === surveyId))
        setSurveyResponses(result.data || [])
        setShowResultsModal(true)
      } else {
        alert('Sonuçlar yüklenemedi')
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      alert('Sonuçlar yüklenemedi')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Anketler</h2>
        <button
          onClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Yeni Anket
        </button>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Henüz anket yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {surveys.map((survey) => {
            // Check if survey is expired
            const isExpired = survey.endDate && new Date(survey.endDate) < new Date()
            
            return (
              <div
                key={survey.id}
                className={`flex items-start justify-between p-4 border rounded-lg ${
                  isExpired 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                    {survey.page && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                        {survey.page === 'carriere' && 'Kariyer'}
                        {survey.page === 'cultuur-educatie' && 'Kültür & Eğitim'}
                        {survey.page === 'projectgroep' && 'Proje Grubu'}
                      </span>
                    )}
                    {isExpired && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                        Süresi Dolmuş
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {survey.questions?.length || 0} soru
                  </p>
                  {survey.deadline && (
                    <p className="text-sm text-gray-500 mt-1">
                      Son Katılım: {new Date(survey.deadline).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                  {survey.endDate && (
                    <p className={`text-xs mt-1 ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                      Bitiş: {new Date(survey.endDate).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewResults(survey.id)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditing(survey)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(survey.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    disabled={loading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <SurveyModal
          survey={editing}
          onClose={() => {
            setShowModal(false)
            setEditing(null)
          }}
          onSave={() => {
            setShowModal(false)
            setEditing(null)
            onRefresh()
          }}
        />
      )}

      {showResultsModal && (
        <ResultsModal
          survey={selectedSurvey}
          responses={surveyResponses}
          onClose={() => {
            setShowResultsModal(false)
            setSelectedSurvey(null)
            setSurveyResponses([])
          }}
        />
      )}
    </div>
  )
}
