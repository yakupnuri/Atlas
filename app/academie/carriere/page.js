'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Calendar,
  Bell,
  Users,
  FileCheck,
  ChevronRight,
  Clock,
  MapPin
} from 'lucide-react'
import SurveyCard from '@/components/SurveyCard'

export default function CarrierePage() {
  const [announcements, setAnnouncements] = useState([])
  const [surveys, setSurveys] = useState([])
  const [seminars, setSeminars] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Survey Modal
  const [showSurveyModal, setShowSurveyModal] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [surveyAnswers, setSurveyAnswers] = useState({})
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [announcementsRes, surveysRes, seminarsRes, jobsRes] = await Promise.all([
        fetch('/api/career?type=announcements'),
        fetch('/api/career?type=surveys&page=carriere'),
        fetch('/api/career?type=seminars'),
        fetch('/api/career?type=jobs')
      ])

      const [announcementsData, surveysData, seminarsData, jobsData] = await Promise.all([
        announcementsRes.json(),
        surveysRes.json(),
        seminarsRes.json(),
        jobsRes.json()
      ])

      if (announcementsData.success) setAnnouncements(announcementsData.data || [])
      if (surveysData.success) setSurveys(surveysData.data || [])
      if (seminarsData.success) setSeminars(seminarsData.data || [])
      if (jobsData.success) setJobs(jobsData.data || [])
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openSurveyModal = (survey) => {
    setSelectedSurvey(survey)
    setSurveyAnswers({})
    setUserName('')
    setUserEmail('')
    setShowSurveyModal(true)
  }

  const handleAnswerChange = (questionId, value) => {
    setSurveyAnswers({
      ...surveyAnswers,
      [questionId]: value
    })
  }

  const submitSurvey = async () => {
    if (!selectedSurvey) return

    const allAnswered = selectedSurvey.questions.every(q => surveyAnswers[q.id])
    if (!allAnswered) {
      alert('Lütfen tüm soruları cevaplayın')
      return
    }

    setSubmitting(true)
    try {
      const answers = selectedSurvey.questions.map(q => ({
        question: q.text,
        answer: surveyAnswers[q.id]
      }))

      const response = await fetch('/api/career/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: selectedSurvey.id,
          answers,
          userName: userName || 'Anonim',
          userEmail
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('Bedankt! Uw enquête is verzonden.')
        setShowSurveyModal(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Briefcase className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Carrièrecentrum
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Bouw aan jouw professionele toekomst met onze ondersteuning
            </p>
          </motion.div>
        </div>
      </section>

      {/* Horizontal News Ticker */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Bell className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm uppercase">Aankondigingen</span>
              </div>
              
              <div className="flex-1 space-y-2">
                {announcements.slice(0, 5).map((announcement) => (
                  <div 
                    key={announcement.id}
                    className="flex items-center gap-3"
                  >
                    <span className="font-semibold">{announcement.title}</span>
                    {announcement.date && (
                      <span className="text-sm opacity-90">
                        • {new Date(announcement.date).toLocaleDateString('nl-NL')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - 2 Column Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Vacatures - Featured Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                  Vacatures
                </h2>
              </div>

              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group border-l-4 border-purple-500"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                                {job.title}
                              </h3>
                              <p className="text-sm font-semibold text-purple-600">{job.company}</p>
                            </div>
                            {job.type && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold">
                                {job.type}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {job.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(job.postedDate || job.createdAt).toLocaleDateString('nl-NL')}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Momenteel geen actieve vacatures</p>
                </div>
              )}
            </motion.section>

            {/* Seminars & Workshops - Featured Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  Seminars & Workshops
                </h2>
              </div>

              {seminars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {seminars.map((seminar, index) => (
                    <motion.div
                      key={seminar.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 hover:shadow-xl transition-all group border border-blue-100"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {seminar.title}
                          </h4>
                          {seminar.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {seminar.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        {seminar.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{new Date(seminar.date).toLocaleDateString('nl-NL', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        )}
                        {seminar.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{seminar.time}</span>
                          </div>
                        )}
                        {seminar.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{seminar.location}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-12 text-center">
                  <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Geen seminars gepland</p>
                </div>
              )}
            </motion.section>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Surveys Section */}
              {surveys.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-green-600" />
                    Actieve Enquêtes
                  </h3>
                  <div className="space-y-4">
                    {surveys.map((survey, index) => (
                      <SurveyCard
                        key={survey.id}
                        survey={survey}
                        onOpen={() => openSurveyModal(survey)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Survey Modal */}
      {showSurveyModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
            <div className="p-6 border-b bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl">
              <h2 className="text-2xl font-bold">{selectedSurvey.title}</h2>
              <p className="text-white/90 mt-1">{selectedSurvey.description}</p>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Naam (optioneel)</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Uw naam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (optioneel)</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="uw@email.nl"
                  />
                </div>
              </div>

              {selectedSurvey.questions?.map((question, index) => (
                <div key={question.id} className="border-t pt-4">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    {index + 1}. {question.text} *
                  </label>

                  {question.type === 'text' && (
                    <input
                      type="text"
                      value={surveyAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Uw antwoord"
                    />
                  )}

                  {question.type === 'textarea' && (
                    <textarea
                      rows="4"
                      value={surveyAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      placeholder="Uw antwoord"
                    />
                  )}

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={surveyAnswers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="ml-3 text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowSurveyModal(false)}
                className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                disabled={submitting}
              >
                Annuleren
              </button>
              <button
                onClick={submitSurvey}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50"
              >
                {submitting ? 'Verzenden...' : 'Verzenden'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
