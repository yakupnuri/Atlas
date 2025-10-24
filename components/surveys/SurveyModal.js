'use client'

import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'

export default function SurveyModal({ survey, onClose }) {
  const [answers, setAnswers] = useState({})
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })
  }

  const handleSubmit = async () => {
    // Validate required questions
    const requiredQuestions = survey.questions.filter(q => q.required)
    const allAnswered = requiredQuestions.every(q => answers[q.id])

    if (!allAnswered) {
      alert('Vul alle verplichte vragen in')
      return
    }

    setSubmitting(true)
    try {
      const formattedAnswers = survey.questions.map(q => ({
        questionId: q.id,
        question: q.text,
        answer: answers[q.id] || ''
      })).filter(a => a.answer)

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
        setSubmitted(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        alert('Fout: ' + result.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Bedankt!</h3>
          <p className="text-gray-600">Uw antwoorden zijn opgeslagen.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{survey.title}</h2>
              {survey.description && (
                <p className="text-white text-opacity-90 mt-1">{survey.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Optional user info */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naam (optioneel)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Uw naam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optioneel)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="uw@email.nl"
              />
            </div>
          </div>

          {/* Questions */}
          {survey.questions?.map((question, index) => (
            <div key={question.id} className="border-t pt-4">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                {index + 1}. {question.text}
                {question.required && <span className="text-red-600 ml-1">*</span>}
              </label>

              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Uw antwoord"
                />
              )}

              {question.type === 'textarea' && (
                <textarea
                  rows="4"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  placeholder="Uw antwoord"
                />
              )}

              {question.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {question.options?.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-3 text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'rating' && (
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleAnswerChange(question.id, rating)}
                      className={`w-12 h-12 rounded-lg font-bold transition-all ${
                        answers[question.id] === rating
                          ? 'bg-yellow-500 text-white scale-110'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {rating}⭐
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            disabled={submitting}
          >
            Annuleren
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50"
          >
            {submitting ? 'Verzenden...' : 'Verzenden'}
          </button>
        </div>
      </div>
    </div>
  )
}
