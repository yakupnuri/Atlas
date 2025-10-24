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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Bar
                        data={{
                          labels: Object.keys(questionStats.distribution),
                          datasets: [
                            {
                              label: 'Aantal antwoorden',
                              data: Object.values(questionStats.distribution),
                              backgroundColor: 'rgba(59, 130, 246, 0.8)',
                              borderColor: 'rgba(59, 130, 246, 1)',
                              borderWidth: 2,
                              borderRadius: 8,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              display: false
                            },
                            title: {
                              display: true,
                              text: 'Verdeling van antwoorden',
                              font: {
                                size: 14,
                                weight: 'bold'
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                stepSize: 1
                              }
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Doughnut Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Doughnut
                        data={{
                          labels: Object.keys(questionStats.distribution),
                          datasets: [
                            {
                              label: 'Percentage',
                              data: Object.values(questionStats.distribution),
                              backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(251, 146, 60, 0.8)',
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(168, 85, 247, 0.8)',
                                'rgba(236, 72, 153, 0.8)',
                              ],
                              borderColor: [
                                'rgba(59, 130, 246, 1)',
                                'rgba(16, 185, 129, 1)',
                                'rgba(251, 146, 60, 1)',
                                'rgba(239, 68, 68, 1)',
                                'rgba(168, 85, 247, 1)',
                                'rgba(236, 72, 153, 1)',
                              ],
                              borderWidth: 2,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 12,
                                font: {
                                  size: 12
                                }
                              }
                            },
                            title: {
                              display: true,
                              text: 'Percentage verdeling',
                              font: {
                                size: 14,
                                weight: 'bold'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {questionStats.type === 'rating' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Average Display */}
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-8">
                      <p className="text-6xl font-bold text-yellow-600 mb-2">
                        {questionStats.average}
                      </p>
                      <p className="text-gray-600 text-lg font-medium">van 5 sterren</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Gebaseerd op {questionStats.total} antwoorden
                      </p>
                    </div>

                    {/* Bar Chart for Rating Distribution */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Bar
                        data={{
                          labels: ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'],
                          datasets: [
                            {
                              label: 'Aantal stemmen',
                              data: [1, 2, 3, 4, 5].map(rating => questionStats.distribution[rating] || 0),
                              backgroundColor: [
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(251, 146, 60, 0.8)',
                                'rgba(234, 179, 8, 0.8)',
                                'rgba(132, 204, 22, 0.8)',
                                'rgba(34, 197, 94, 0.8)',
                              ],
                              borderColor: [
                                'rgba(239, 68, 68, 1)',
                                'rgba(251, 146, 60, 1)',
                                'rgba(234, 179, 8, 1)',
                                'rgba(132, 204, 22, 1)',
                                'rgba(34, 197, 94, 1)',
                              ],
                              borderWidth: 2,
                              borderRadius: 8,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              display: false
                            },
                            title: {
                              display: true,
                              text: 'Verdeling van beoordelingen',
                              font: {
                                size: 14,
                                weight: 'bold'
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                stepSize: 1
                              }
                            }
                          }
                        }}
                      />
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
