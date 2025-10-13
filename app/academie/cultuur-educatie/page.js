'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Calendar, 
  Download, 
  FileText, 
  Clock,
  Users,
  Bell,
  ChevronRight,
  Newspaper
} from 'lucide-react'

export default function CultuurEducatiePage() {
  const [announcements, setAnnouncements] = useState([])
  const [articles, setArticles] = useState([])
  const [documents, setDocuments] = useState([])
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // TODO: Replace with real API calls
      setAnnouncements([
        { id: 1, title: 'Nieuwe lessen starten volgende week maandag', date: '2025-01-15' },
        { id: 2, title: 'Ouderavond gepland op 20 januari', date: '2025-01-20' },
        { id: 3, title: 'Wintervakantie van 15-25 februari', date: '2025-02-15' }
      ])
      
      setArticles([
        { id: 1, title: 'Het belang van cultureel onderwijs', excerpt: 'Waarom culturele educatie belangrijk is voor de ontwikkeling van kinderen...', author: 'Dr. Ahmed Yılmaz', date: '2025-01-10' },
        { id: 2, title: 'Tips voor huiswerk begeleiding', excerpt: 'Praktische tips voor ouders om hun kinderen te ondersteunen bij huiswerk...', author: 'Fatma Demir', date: '2025-01-08' }
      ])
      
      setDocuments([
        { id: 1, name: 'Cursusmateriaal Turks Niveau 1', type: 'PDF', size: '2.3 MB', url: '#' },
        { id: 2, name: 'Huisreglement Educatiecentrum', type: 'PDF', size: '1.1 MB', url: '#' },
        { id: 3, name: 'Jaarkalender 2025', type: 'PDF', size: '850 KB', url: '#' }
      ])
      
      setSchedule([
        { day: 'Maandag', time: '18:00-19:30', subject: 'Turks Taal - Niveau 1', teacher: 'Leraar A' },
        { day: 'Maandag', time: '19:45-21:15', subject: 'Turks Taal - Niveau 2', teacher: 'Leraar B' },
        { day: 'Dinsdag', time: '18:00-19:30', subject: 'Geschiedenis & Cultuur', teacher: 'Leraar C' },
        { day: 'Woensdag', time: '18:00-19:30', subject: 'Muziek & Kunst', teacher: 'Leraar D' },
        { day: 'Donderdag', time: '18:00-19:30', subject: 'Literatuur', teacher: 'Leraar E' }
      ])
      
      setCourses([
        { id: 1, name: 'Turks Taal', level: 'Niveau 1-3', description: 'Leer de Turkse taal van basis tot gevorderd niveau', icon: '🇹🇷' },
        { id: 2, name: 'Geschiedenis', level: 'Alle niveaus', description: 'Ontdek de rijke geschiedenis en cultuur', icon: '📚' },
        { id: 3, name: 'Muziek & Kunst', level: 'Alle niveaus', description: 'Traditionele en moderne muziek en kunst', icon: '🎨' },
        { id: 4, name: 'Literatuur', level: 'Gevorderd', description: 'Klassieke en moderne literatuur', icon: '📖' }
      ])
      
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

      {/* Announcements Ticker */}
      {announcements.length > 0 && (
        <div className="bg-orange-500 text-white py-3 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 flex-shrink-0" />
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

      <div className="container mx-auto px-4 py-12">
        {/* Weekly Schedule */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Wekelijks Rooster</h2>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Dag</th>
                    <th className="px-6 py-4 text-left">Tijd</th>
                    <th className="px-6 py-4 text-left">Vak</th>
                    <th className="px-6 py-4 text-left">Docent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedule.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.day}</td>
                      <td className="px-6 py-4 text-gray-700 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        {item.time}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{item.subject}</td>
                      <td className="px-6 py-4 text-gray-600">{item.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Courses Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Onze Cursussen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{course.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                <p className="text-sm text-blue-600 mb-3">{course.level}</p>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Documents & Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <Download className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Documenten & Materialen</h2>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <FileText className="w-10 h-10 text-red-500 mr-4" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {doc.name}
                    </h4>
                    <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Articles for Parents & Students */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <Newspaper className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Artikelen & Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Door {article.author} • {new Date(article.date).toLocaleDateString('nl-NL')}
                </p>
                <p className="text-gray-700 mb-4">{article.excerpt}</p>
                <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700">
                  Lees meer
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Calendar/Important Dates */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Belangrijke Data</h2>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center mr-4">
                  <span className="text-xs">JAN</span>
                  <span className="text-2xl font-bold">20</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ouderavond</h4>
                  <p className="text-gray-600 text-sm">Bespreking voortgang en plannen voor het nieuwe seizoen</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-lg flex flex-col items-center justify-center mr-4">
                  <span className="text-xs">FEB</span>
                  <span className="text-2xl font-bold">15</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Wintervakantie Begin</h4>
                  <p className="text-gray-600 text-sm">Lessen hervat op 26 februari</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-600 text-white rounded-lg flex flex-col items-center justify-center mr-4">
                  <span className="text-xs">MRT</span>
                  <span className="text-2xl font-bold">15</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Tussentijdse Evaluatie</h4>
                  <p className="text-gray-600 text-sm">Voortgangsrapportages worden verzonden</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl p-8">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Heeft u vragen?</h2>
            <p className="text-lg mb-6 text-white/90">
              Neem gerust contact met ons op voor meer informatie
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Opnemen
            </button>
          </div>
        </motion.section>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
