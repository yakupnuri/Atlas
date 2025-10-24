'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  FileText, 
  ClipboardList, 
  Calendar,
  Bell,
  Users,
  FileCheck,
  ChevronRight,
  Clock
} from 'lucide-react'
import SeminarCard from '@/components/career/SeminarCard'
import SurveyCard from '@/components/career/SurveyCard'
import JobCard from '@/components/career/JobCard'
import JobDetailModal from '@/components/career/JobDetailModal'

export default function CarrierePage() {
  const [announcements, setAnnouncements] = useState([])
  const [surveys, setSurveys] = useState([])
  const [seminars, setSeminars] = useState([])
  const [jobs, setJobs] = useState([])
  const [tickerJobs, setTickerJobs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Survey Modal
  const [showSurveyModal, setShowSurveyModal] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [surveyAnswers, setSurveyAnswers] = useState({})
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Job Detail Modal
  const [showJobModal, setShowJobModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [announcementsRes, surveysRes, seminarsRes, jobsRes] = await Promise.all([
        fetch('/api/career?type=announcements'),
        fetch('/api/career?type=surveys'),
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
      if (jobsData.success) {
        setJobs(jobsData.data || [])
        setTickerJobs((jobsData.data || []).filter(job => job.showInTicker))
      }
      
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

  const openJobModal = (job) => {
    setSelectedJob(job)
    setShowJobModal(true)
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
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-16">
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
        <div className="bg-orange-500 text-white py-3 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 flex-shrink-0 animate-pulse" />
              <div className="flex animate-scroll whitespace-nowrap">
                {announcements.concat(announcements).map((announcement, index) => (
                  <span key={`${announcement.id}-${index}`} className="mx-8">
                    <strong>NIEUWS:</strong> {announcement.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - 2 Column Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vacatures (Job Postings) */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-600" />
                Vacatures
              </h2>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div 
                        onClick={() => openJobModal(job)}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all group border-l-4 border-purple-500 cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                  {job.title}
                                </h4>
                                <p className="text-sm text-gray-600">{job.company}</p>
                              </div>
                              {job.type && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                                  {job.type}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Geplaatst: {new Date(job.postedDate || job.createdAt).toLocaleDateString('nl-NL')}
                              </span>
                              {job.location && (
                                <span className="text-xs text-gray-500">{job.location}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Momenteel geen actieve vacatures</p>
                </div>
              )}
            </motion.section>

            {/* Seminars & Workshops */}
            {seminars.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Seminars & Workshops
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {seminars.map((seminar, index) => (
                    <motion.div
                      key={seminar.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all group h-full">
                        <Users className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {seminar.title}
                        </h4>
                        {seminar.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{seminar.description}</p>
                        )}
                        <div className="space-y-1 text-xs text-gray-600">
                          {seminar.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(seminar.date).toLocaleDateString('nl-NL')}
                            </div>
                          )}
                          {seminar.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {seminar.time}
                            </div>
                          )}
                          {seminar.location && (
                            <div className="text-xs text-gray-500">{seminar.location}</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Surveys */}
            {surveys.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-green-600" />
                  Actieve Enquêtes
                </h2>
                <div className="space-y-3">
                  {surveys.map((survey, index) => (
                    <motion.div
                      key={survey.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="bg-white rounded-lg p-3 flex items-center justify-center">
                        <FileCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{survey.title}</h4>
                        {survey.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">{survey.description}</p>
                        )}
                        {survey.endDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Sluit: {new Date(survey.endDate).toLocaleDateString('nl-NL')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => openSurveyModal(survey)}
                        className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Doe mee
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column - News/Announcements */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-orange-600" />
                Nieuws & Mededelingen
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
                {announcements.length > 0 ? (
                  <div className="relative h-full overflow-hidden">
                    <div className="animate-scroll-up space-y-4 p-6">
                      {announcements.concat(announcements).map((announcement, index) => (
                        <motion.div
                          key={`${announcement.id}-${index}`}
                          className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500"
                        >
                          <div className="flex items-start gap-2">
                            <Bell className="w-4 h-4 text-orange-600 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm mb-1">
                                {announcement.title}
                              </h4>
                              {announcement.content && (
                                <p className="text-xs text-gray-600 line-clamp-3">
                                  {announcement.content}
                                </p>
                              )}
                              {announcement.date && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(announcement.date).toLocaleDateString('nl-NL')}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Geen nieuws beschikbaar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Modal - Shortened for space */}
      {showSurveyModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl my-8">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{selectedSurvey.title}</h2>
              <p className="text-gray-600 mt-1">{selectedSurvey.description}</p>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Naam (optioneel)</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Uw naam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (optioneel)</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Uw antwoord"
                    />
                  )}

                  {question.type === 'textarea' && (
                    <textarea
                      rows="4"
                      value={surveyAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
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
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-3 text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'yes-no' && (
                    <div className="flex gap-4">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                        <input
                          type="radio"
                          name={question.id}
                          value="Ja"
                          checked={surveyAnswers[question.id] === 'Ja'}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-900">Ja</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                        <input
                          type="radio"
                          name={question.id}
                          value="Nee"
                          checked={surveyAnswers[question.id] === 'Nee'}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-900">Nee</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowSurveyModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Annuleren
              </button>
              <button
                onClick={submitSurvey}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
              >
                {submitting ? 'Verzenden...' : 'Verzenden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {showJobModal && selectedJob && (
        <JobDetailModal 
          job={selectedJob}
          onClose={() => setShowJobModal(false)}
        />
      )}

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
