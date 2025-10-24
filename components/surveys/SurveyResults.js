'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Users, BarChart3, PieChart, Download } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function SurveyResults({ survey, onClose }) {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})

  useEffect(() => {
    fetchResponses()
  }, [survey.id])

  const fetchResponses = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/surveys/responses?surveyId=${survey.id}`)
      const result = await response.json()
      if (result.success) {
        setResponses(result.data)
        calculateStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (responseData) => {
    const calculated = {}

    survey.questions.forEach((question) => {
      const answers = responseData.map((response) => 
        response.answers.find((a) => a.questionId === question.id)?.answer
      ).filter(Boolean)

      if (question.type === 'multiple-choice') {
        // Calculate distribution for multiple choice
        const distribution = {}
        answers.forEach((answer) => {
          distribution[answer] = (distribution[answer] || 0) + 1
        })
        calculated[question.id] = {
          type: 'multiple-choice',
          distribution,
          total: answers.length
        }
      } else if (question.type === 'rating') {
        // Calculate average rating
        const ratings = answers.map(Number).filter((n) => !isNaN(n))
        const average = ratings.length > 0 
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
          : 0
        calculated[question.id] = {
          type: 'rating',
          average,
          total: ratings.length,
          distribution: ratings.reduce((acc, rating) => {
            acc[rating] = (acc[rating] || 0) + 1
            return acc
          }, {})
        }
      } else {
        // Text answers
        calculated[question.id] = {
          type: 'text',
          answers: answers.slice(0, 10), // Show first 10
          total: answers.length
        }
      }
    })

    setStats(calculated)
  }

  const exportToCSV = () => {
    let csv = 'Naam,Email,Datum'
    survey.questions.forEach((q) => {
      csv += `,${q.text}`
    })
    csv += '\n'

    responses.forEach((response) => {
      csv += `${response.userName},${response.userEmail},${new Date(response.submittedAt).toLocaleDateString('nl-NL')}`
      survey.questions.forEach((q) => {
        const answer = response.answers.find((a) => a.questionId === q.id)?.answer || ''
        csv += `,"${answer.replace(/"/g, '""')}"`
      })
      csv += '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enquete-${survey.title.replace(/[^a-z0-9]/gi, '-')}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Resultaten laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Enquête Resultaten
            </h2>
            <p className="text-sm text-gray-600">{survey.title}</p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          disabled={responses.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Exporteren naar CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" />
            <span className="text-sm opacity-90">Totaal Deelnemers</span>
          </div>
          <p className="text-4xl font-bold">{responses.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8" />
            <span className="text-sm opacity-90">Vragen</span>
          </div>
          <p className="text-4xl font-bold">{survey.questions?.length || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <PieChart className="w-8 h-8" />
            <span className="text-sm opacity-90">Voltooiingspercentage</span>
          </div>
          <p className="text-4xl font-bold">
            {responses.length > 0 ? '100' : '0'}%
          </p>
        </div>
      </div>

      {/* Question Results */}
      {responses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Nog geen reacties ontvangen</p>
        </div>
      ) : (
        <div className="space-y-6">
          {survey.questions.map((question, qIndex) => {
            const questionStats = stats[question.id]
            if (!questionStats) return null

            return (
              <div key={question.id} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {qIndex + 1}. {question.text}
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({questionStats.total} antwoorden)
                  </span>
                </h3>

                {questionStats.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    {Object.entries(questionStats.distribution).map(([option, count]) => {
                      const percentage = ((count / questionStats.total) * 100).toFixed(1)
                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{option}</span>
                            <span className="text-gray-600">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {questionStats.type === 'rating' && (
                  <div>
                    <div className="text-center mb-4">
                      <p className="text-5xl font-bold text-blue-600">
                        {questionStats.average}
                      </p>
                      <p className="text-gray-600 text-sm">van 5 sterren</p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = questionStats.distribution[rating] || 0
                        const percentage = questionStats.total > 0
                          ? ((count / questionStats.total) * 100).toFixed(1)
                          : 0
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8">{rating}⭐</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-yellow-500 h-full rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-16 text-right">
                              {count} ({percentage}%)
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {questionStats.type === 'text' && (
                  <div className="space-y-3">
                    {questionStats.answers.map((answer, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                        "{answer}"
                      </div>
                    ))}
                    {questionStats.total > 10 && (
                      <p className="text-sm text-gray-500 text-center">
                        ... en nog {questionStats.total - 10} antwoorden
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
