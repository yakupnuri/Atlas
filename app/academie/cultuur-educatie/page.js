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
  const [importantDates, setImportantDates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch all data from API
      const [announcementsRes, articlesRes, documentsRes, scheduleRes, coursesRes, calendarRes] = await Promise.all([
        fetch('/api/education?type=announcements'),
        fetch('/api/education?type=articles'),
        fetch('/api/education?type=documents'),
        fetch('/api/education?type=schedule'),
        fetch('/api/education?type=courses'),
        fetch('/api/education?type=calendar')
      ])

      const [announcementsData, articlesData, documentsData, scheduleData, coursesData, calendarData] = await Promise.all([
        announcementsRes.json(),
        articlesRes.json(),
        documentsRes.json(),
        scheduleRes.json(),
        coursesRes.json(),
        calendarRes.json()
      ])

      if (announcementsData.success) setAnnouncements(announcementsData.data || [])
      if (articlesData.success) setArticles(articlesData.data || [])
      if (documentsData.success) setDocuments(documentsData.data || [])
      if (scheduleData.success) setSchedule(scheduleData.data || [])
      if (coursesData.success) setCourses(coursesData.data || [])
      if (calendarData.success) setImportantDates(calendarData.data || [])
      
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
            {schedule.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nog geen rooster beschikbaar</p>
            ) : (
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
            )}
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
            {courses.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">Nog geen cursussen beschikbaar</div>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{course.icon || '📚'}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-blue-600 mb-3">{course.level}</p>
                  <p className="text-gray-600 text-sm">{course.description}</p>
                </div>
              ))
            )}
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
            {documents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nog geen documenten beschikbaar</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.filePath || doc.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <FileText className="w-10 h-10 text-red-500 mr-4" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {doc.title || doc.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {doc.fileName || doc.type} {doc.fileSize ? `• ${(doc.fileSize / 1024).toFixed(0)} KB` : (doc.size ? `• ${doc.size}` : '')}
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </a>
                ))}
              </div>
            )}
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
            {articles.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">Nog geen artikelen beschikbaar</div>
            ) : (
              articles.map((article) => (
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
              ))
            )}
          </div>
        </motion.section>

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
            {importantDates.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nog geen belangrijke data beschikbaar</p>
            ) : (
              <div className="space-y-4">
                {importantDates.map((item) => {
                  const itemDate = new Date(item.date);
                  const monthNames = ['JAN', 'FEB', 'MRT', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];
                  const month = monthNames[itemDate.getMonth()];
                  const day = itemDate.getDate();
                  
                  const colorClasses = {
                    blue: 'bg-blue-50 border-blue-200',
                    green: 'bg-green-50 border-green-200',
                    purple: 'bg-purple-50 border-purple-200',
                    orange: 'bg-orange-50 border-orange-200',
                    red: 'bg-red-50 border-red-200'
                  };
                  
                  const badgeColors = {
                    blue: 'bg-blue-600',
                    green: 'bg-green-600',
                    purple: 'bg-purple-600',
                    orange: 'bg-orange-600',
                    red: 'bg-red-600'
                  };
                  
                  return (
                    <div key={item.id} className={`flex items-start p-4 ${colorClasses[item.color] || colorClasses.blue} border rounded-lg`}>
                      <div className={`flex-shrink-0 w-16 h-16 ${badgeColors[item.color] || badgeColors.blue} text-white rounded-lg flex flex-col items-center justify-center mr-4`}>
                        <span className="text-xs">{month}</span>
                        <span className="text-2xl font-bold">{day}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
