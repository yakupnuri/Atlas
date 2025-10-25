'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import ContactModal from '@/components/ContactModal';
import AnnouncementsTicker from '@/components/education/AnnouncementsTicker';
import ArticlesSection from '@/components/education/ArticlesSection';
import VideosSection from '@/components/education/VideosSection';
import DocumentsSection from '@/components/education/DocumentsSection';
import ScheduleSection from '@/components/education/ScheduleSection';
import CoursesSection from '@/components/education/CoursesSection';
import CalendarSection from '@/components/education/CalendarSection';
import SurveyCard from '@/components/surveys/SurveyCard';

export default function CultuurEducatiePage() {
  const [announcements, setAnnouncements] = useState([])
  const [articles, setArticles] = useState([])
  const [videos, setVideos] = useState([])
  const [documents, setDocuments] = useState([])
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [calendar, setCalendar] = useState([])
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [
        announcementsRes, 
        articlesRes, 
        videosRes, 
        documentsRes,
        scheduleRes,
        coursesRes,
        calendarRes,
        surveysRes
      ] = await Promise.all([
        fetch('/api/education?type=announcements'),
        fetch('/api/education?type=articles'),
        fetch('/api/education?type=videos'),
        fetch('/api/education?type=documents'),
        fetch('/api/education?type=schedule'),
        fetch('/api/education?type=courses'),
        fetch('/api/education?type=calendar'),
        fetch('/api/surveys?module=education')
      ])

      const [
        announcementsData, 
        articlesData, 
        videosData, 
        documentsData,
        scheduleData,
        coursesData,
        calendarData,
        surveysData
      ] = await Promise.all([
        announcementsRes.json(),
        articlesRes.json(),
        videosRes.json(),
        documentsRes.json(),
        scheduleRes.json(),
        coursesRes.json(),
        calendarRes.json(),
        surveysRes.json()
      ])

      if (announcementsData.success) setAnnouncements(announcementsData.data || [])
      if (articlesData.success) setArticles(articlesData.data || [])
      if (videosData.success) setVideos(videosData.data || [])
      if (documentsData.success) setDocuments(documentsData.data || [])
      if (scheduleData.success) setSchedule(scheduleData.data || [])
      if (coursesData.success) setCourses(coursesData.data || [])
      if (calendarData.success) setCalendar(calendarData.data || [])
      if (surveysData.success) setSurveys(surveysData.data || [])
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cultuur & Educatiecentrum
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Welkom bij ons educatiecentrum waar we taal, cultuur en traditie samenbrengen
            </p>
          </motion.div>
        </div>
      </section>

      {/* Announcements Ticker - BELOW HERO */}
      <AnnouncementsTicker announcements={announcements} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <ArticlesSection articles={articles} loading={loading} />
        <VideosSection videos={videos} loading={loading} />
        <CoursesSection courses={courses} loading={loading} />
        <ScheduleSection schedule={schedule} loading={loading} />
        <DocumentsSection documents={documents} loading={loading} />
        <CalendarSection events={calendar} loading={loading} />
        
        {/* Surveys Section */}
        {surveys.length > 0 && (
          <section className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enquêtes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {surveys.map((survey) => (
                  <SurveyCard
                    key={survey.id}
                    survey={survey}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Heb je vragen?</h2>
          <p className="text-xl mb-8 opacity-90">
            Neem contact met ons op voor meer informatie over onze programma's
          </p>
          <button
            onClick={() => setContactModalOpen(true)}
            className="inline-block bg-white text-blue-600 py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Neem Contact Op
          </button>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        pageContext="Cultuur & Educatiecentrum"
      />
    </div>
  );
}
