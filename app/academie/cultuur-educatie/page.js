'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import ContactModal from '@/components/ContactModal';
import AnnouncementsSection from '@/components/education/AnnouncementsSection';
import ArticlesSection from '@/components/education/ArticlesSection';
import VideosSection from '@/components/education/VideosSection';
import SurveyCard from '@/components/surveys/SurveyCard';
import SurveyModal from '@/components/surveys/SurveyModal';

export default function CultuurEducatiePage() {
  const [announcements, setAnnouncements] = useState([])
  const [articles, setArticles] = useState([])
  const [videos, setVideos] = useState([])
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [announcementsRes, articlesRes, videosRes, surveysRes] = await Promise.all([
        fetch('/api/education?type=announcements'),
        fetch('/api/education?type=articles'),
        fetch('/api/education?type=videos'),
        fetch('/api/surveys?module=education')
      ])

      const [announcementsData, articlesData, videosData, surveysData] = await Promise.all([
        announcementsRes.json(),
        articlesRes.json(),
        videosRes.json(),
        surveysRes.json()
      ])

      if (announcementsData.success) setAnnouncements(announcementsData.data || [])
      if (articlesData.success) setArticles(articlesData.data || [])
      if (videosData.success) setVideos(videosData.data || [])
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <AnnouncementsSection announcements={announcements} loading={loading} />
        <ArticlesSection articles={articles} loading={loading} />
        <VideosSection videos={videos} loading={loading} />
        
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
                    onClick={() => setSelectedSurvey(survey)}
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

      {/* Modals */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        pageContext="Cultuur & Educatiecentrum"
      />

      {selectedSurvey && (
        <SurveyModal
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
        />
      )}
    </div>
  );
}
