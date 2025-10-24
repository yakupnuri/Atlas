'use client'

import { useState, useEffect } from 'react'
import { X, Send, CheckCircle, AlertCircle, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SurveyModal({ survey, isOpen, onClose }) {
  const [answers, setAnswers] = useState({})
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && survey) {
      // Reset form when modal opens
      setAnswers({})
      setUserName('')
      setUserEmail('')
      setIsSubmitted(false)
      setError('')
    }
  }, [isOpen, survey])

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })
  }

  const validateForm = () => {
    // Check if all required questions are answered
    if (!survey || !survey.questions) return false

    for (const question of survey.questions) {
      if (question.required) {
        const answer = answers[question.id]
        if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      setError('Vul alle verplichte vragen in')
      return
    }

    setIsSubmitting(true)

    try {
      // Format answers for submission
      const formattedAnswers = survey.questions.map(question => ({
        questionId: question.id,
        question: question.text,
        answer: answers[question.id] || ''
      }))

      const response = await fetch('/api/surveys/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey.id,
          answers: formattedAnswers,
          userName: userName || 'Anoniem',
          userEmail: userEmail || ''
        })
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setError(result.error || 'Er is een fout opgetreden')
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
      setError('Er is een fout opgetreden bij het verzenden')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question, index) => {
    const value = answers[question.id] || ''

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Uw antwoord..."
            required={question.required}
          />
        )

      case 'textarea':
        return (
          <textarea
            rows="4"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
            placeholder="Uw antwoord..."
            required={question.required}
          />
        )

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {(question.options || []).map((option, optIndex) => (
              <label
                key={optIndex}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  value === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  required={question.required}
                />
                <span className="text-gray-800 font-medium">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'rating':
        return (
          <div className="flex gap-2 justify-center py-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleAnswerChange(question.id, rating.toString())}
                className={`p-3 transition-all transform hover:scale-110 ${
                  parseInt(value) >= rating
                    ? 'text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star
                  className="w-8 h-8"
                  fill={parseInt(value) >= rating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        )

      case 'yes-no':
        return (
          <div className="flex gap-4">
            <label
              className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                value === 'Ja'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value="Ja"
                checked={value === 'Ja'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500"
                required={question.required}
              />
              <span className="text-gray-800 font-bold">Ja</span>
            </label>
            <label
              className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                value === 'Nee'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value="Nee"
                checked={value === 'Nee'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-5 h-5 text-red-600 focus:ring-2 focus:ring-red-500"
                required={question.required}
              />
              <span className="text-gray-800 font-bold">Nee</span>
            </label>
          </div>
        )

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Uw antwoord..."
            required={question.required}
          />
        )
    }
  }

  if (!survey) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{survey.title}</h2>
                {survey.description && (
                  <p className="text-blue-100 text-sm">{survey.description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Bedankt voor uw deelname!
                  </h3>
                  <p className="text-gray-600">
                    Uw antwoorden zijn succesvol verzonden.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Optional User Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-700 mb-3 font-medium">
                      Optioneel: Vul uw gegevens in (u kunt ook anoniem deelnemen)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Naam
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Uw naam"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="uw@email.nl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-6">
                    {survey.questions?.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {question.text}
                              {question.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </h3>
                          </div>
                        </div>
                        {renderQuestion(question, index)}
                      </div>
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-red-800 text-sm font-medium">{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !validateForm()}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Verzenden...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Verzenden</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
