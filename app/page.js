'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  ArrowRight, 
  Target, 
  Heart, 
  Award,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Calendar,
  Newspaper,
  FileText,
  MessageSquare,
  Sparkles,
  CheckCircle,
  BookOpen,
  Clock,
  TrendingUp,
  Bell,
  FileCheck,
  ChevronRight,
  Download
} from 'lucide-react';
import ContactModal from '@/components/ContactModal';
import HeroSlider from '@/components/HeroSlider';

// Cultuur & Educatiecentrum Section Component
function CultuurEducatieSection() {
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, documentsRes, calendarRes, announcementsRes] = await Promise.all([
        fetch('/api/education?type=courses'),
        fetch('/api/education?type=documents'),
        fetch('/api/education?type=calendar'),
        fetch('/api/education?type=announcements')
      ]);
      
      const coursesData = await coursesRes.json();
      const documentsData = await documentsRes.json();
      const calendarData = await calendarRes.json();
      const announcementsData = await announcementsRes.json();
      
      setCourses((coursesData.data || []).slice(0, 3));
      setDocuments((documentsData.data || []).slice(0, 3));
      setImportantDates((calendarData.data || []).slice(0, 3));
      setAnnouncements(announcementsData.data || []);
    } catch (error) {
      console.error('Error fetching education data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold">Cultuur & Educatiecentrum</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Educatie & Ontwikkeling
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek onze cursussen, documenten en belangrijke data
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Onze Cursussen */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Onze Cursussen
              </h3>
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href="/academie/cultuur-educatie">
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all group">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {course.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                              <div className="flex items-center text-xs text-gray-500 gap-4">
                                {course.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {course.duration}
                                  </span>
                                )}
                                {course.level && (
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {course.level}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Geen cursussen beschikbaar</p>
                </div>
              )}
            </div>

            {/* Documenten & Materialen */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-green-600" />
                Documenten & Materialen
              </h3>
              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group"
                      >
                        <Download className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-gray-500">{doc.fileType?.toUpperCase()}</p>
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Geen documenten beschikbaar</p>
                </div>
              )}
            </div>

            {/* Belangrijke Data */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-600" />
                Belangrijke Data
              </h3>
              {importantDates.length > 0 ? (
                <div className="space-y-3">
                  {importantDates.map((date, index) => (
                    <motion.div
                      key={date.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="bg-white rounded-lg p-3 text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-orange-600">
                          {new Date(date.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-600 uppercase">
                          {new Date(date.date).toLocaleDateString('nl-NL', { month: 'short' })}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{date.title}</h4>
                        {date.description && (
                          <p className="text-sm text-gray-600">{date.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Geen belangrijke data beschikbaar</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - News Ticker */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-red-600" />
                Nieuws
              </h3>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
                {announcements.length > 0 ? (
                  <div className="relative h-full overflow-hidden">
                    <div className="animate-scroll-up space-y-4 p-6">
                      {announcements.concat(announcements).map((announcement, index) => (
                        <motion.div
                          key={`${announcement.id}-${index}`}
                          className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-l-4 border-red-500"
                        >
                          <div className="flex items-start gap-2">
                            <Bell className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm mb-1">
                                {announcement.title}
                              </h4>
                              {announcement.description && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {announcement.description}
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
                      <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Geen nieuws beschikbaar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/academie/cultuur-educatie"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
          >
            <GraduationCap className="w-5 h-5" />
            Bezoek Cultuur & Educatiecentrum
          </Link>
        </div>
      </div>
    </section>
  );
}

// Carrièrecentrum Section Component
function CarrierecentrumSection() {
  const [jobs, setJobs] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, seminarsRes, surveysRes, announcementsRes] = await Promise.all([
        fetch('/api/career?type=jobs'),
        fetch('/api/career?type=seminars'),
        fetch('/api/career?type=surveys'),
        fetch('/api/career?type=announcements')
      ]);
      
      const jobsData = await jobsRes.json();
      const seminarsData = await seminarsRes.json();
      const surveysData = await surveysRes.json();
      const announcementsData = await announcementsRes.json();
      
      setJobs((jobsData.data || []).slice(0, 3));
      setSeminars((seminarsData.data || []).slice(0, 3));
      setSurveys((surveysData.data || []).slice(0, 3));
      setAnnouncements(announcementsData.data || []);
    } catch (error) {
      console.error('Error fetching career data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
              <Briefcase className="w-5 h-5" />
              <span className="font-semibold">Carrièrecentrum</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Carrière & Ontwikkeling
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vacatures, seminars, enquêtes en professionele ontwikkeling
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vacatures (Job Postings) */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-600" />
                Vacatures
              </h3>
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
                      <Link href="/academie/carriere">
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all group border-l-4 border-purple-500">
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
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                Geplaatst: {new Date(job.postedDate || job.createdAt).toLocaleDateString('nl-NL')}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Momenteel geen actieve vacatures</p>
                </div>
              )}
            </div>

            {/* Seminars */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Seminars & Workshops
              </h3>
              {seminars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {seminars.map((seminar, index) => (
                    <motion.div
                      key={seminar.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href="/academie/carriere">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all group h-full">
                          <Users className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                          <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {seminar.title}
                          </h4>
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
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Geen seminars gepland</p>
                </div>
              )}
            </div>

            {/* Surveys */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-green-600" />
                Actieve Enquêtes
              </h3>
              {surveys.length > 0 ? (
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
                      </div>
                      <Link href="/academie/carriere">
                        <button className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Doe mee
                        </button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Geen actieve enquêtes</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - News/Announcements */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-orange-600" />
                Nieuws
              </h3>
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
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {announcement.content}
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

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/academie/carriere"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
          >
            <Briefcase className="w-5 h-5" />
            Bezoek Carrièrecentrum
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedNewsIndex, setSelectedNewsIndex] = useState(0);

  useEffect(() => {
    fetchUpcomingEvents();
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      const sortedNews = (data.news || [])
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 4);
      setLatestNews(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch('/api/events?upcoming=true');
      const data = await response.json();
      setUpcomingEvents(data.events.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const academiePrograms = [
    {
      title: 'Cultuur & Educatiecentrum',
      description: 'Ontdek educatieve programma\'s, cursussen in kunst, cultuur en taal voor alle leeftijden.',
      icon: GraduationCap,
      href: '/academie/cultuur-educatie',
      gradient: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600'
    },
    {
      title: 'Carrièrecentrum',
      description: 'Professionele ontwikkeling, carrière coaching, workshops en mentorschap programma\'s.',
      icon: Briefcase,
      href: '/academie/carriere',
      gradient: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600'
    },
    {
      title: 'Projectgroep',
      description: 'Doe mee aan gemeenschapsprojecten, vrijwilligerswerk en maak impact in de samenleving.',
      icon: FolderKanban,
      href: '/academie/projectgroep',
      gradient: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600'
    },
  ];

  const quickLinks = [
    { title: 'Evenementen', icon: Calendar, href: '/evenementen', color: 'from-orange-500 to-red-500' },
    { title: 'Nieuws', icon: Newspaper, href: '/nieuws', color: 'from-blue-500 to-indigo-500' },
    { title: 'ANBI Status', icon: FileText, href: '/anbi', color: 'from-green-500 to-teal-500' },
    { title: 'Contact', icon: MessageSquare, href: '/contact', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* News Highlight Section - Full Width with Hover Functionality */}
      <section className="py-16 container mx-auto px-4">
        {latestNews.length > 0 ? (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                <Newspaper className="w-5 h-5" />
                <span className="font-semibold">Laatste Nieuws</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Blijf Op De Hoogte
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ontdek de nieuwste ontwikkelingen, verhalen en updates van Stichting Atlas
              </p>
            </div>

            {/* Main Preview Card - Displays selected/hovered news */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = `/nieuws/${latestNews[selectedNewsIndex]?.slug}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-[250px] md:h-[350px] lg:h-[500px]">
                  <img
                    src={latestNews[selectedNewsIndex]?.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'}
                    alt={latestNews[selectedNewsIndex]?.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden"></div>
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <span className="bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold uppercase shadow-lg">
                      {latestNews[selectedNewsIndex]?.category || 'Nieuws'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-3 md:mb-4">
                    <span className="text-xs md:text-sm text-gray-500">
                      {new Date(latestNews[selectedNewsIndex]?.publishDate).toLocaleDateString('nl-NL', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                    {latestNews[selectedNewsIndex]?.title}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-4 md:mb-6 line-clamp-3 md:line-clamp-4">
                    {latestNews[selectedNewsIndex]?.excerpt}
                  </p>
                  <div className="flex items-center text-[#05B6C4] font-semibold text-sm md:text-base lg:text-lg">
                    Lees meer
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* News Items Grid - Hover to preview above */}
            {latestNews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {latestNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 group ${
                      selectedNewsIndex === index ? 'ring-2 md:ring-4 ring-blue-500' : ''
                    }`}
                    onMouseEnter={() => setSelectedNewsIndex(index)}
                    onClick={() => window.location.href = `/nieuws/${news.slug}`}
                  >
                    <div className="relative h-24 md:h-48">
                      <img
                        src={news.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300'}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                        <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2">
                          {news.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl shadow-lg h-full flex items-center justify-center p-12">
            <div className="text-center">
              <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Geen nieuws beschikbaar</p>
            </div>
          </div>
        )}
      </section>

      {/* Quick Links Bar */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#05B6C4] transition-colors">
                      {link.title}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Atlas Academie Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                <GraduationCap className="w-5 h-5" />
                <span className="font-semibold">Atlas Academie</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Ontdek Onze Programma's
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Van educatie tot carrièreontwikkeling - ontdek programma's die jouw toekomst vormgeven
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {academiePrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <motion.div
                  key={program.href}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="h-full"
                >
                  <Link
                    href={program.href}
                    className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${program.gradient} opacity-60`}></div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl">
                        <Icon className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#05B6C4] transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-1">
                        {program.description}
                      </p>
                      <div className="flex items-center text-[#05B6C4] font-semibold group-hover:gap-3 transition-all">
                        Meer informatie
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/academie"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
            >
              Bekijk Alle Programma's
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Evenementen</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Aankomende Evenementen
                </h2>
                <p className="text-xl text-gray-600">
                  Doe mee met onze activiteiten en ontmoet nieuwe mensen
                </p>
              </motion.div>
            </div>
            <Link
              href="/evenementen"
              className="hidden md:inline-flex items-center gap-2 text-[#05B6C4] font-semibold hover:gap-3 transition-all"
            >
              Bekijk alle evenementen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#05B6C4] border-t-transparent"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link
                    href={`/evenementen/${event.slug}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group h-full"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg">
                        <span className="text-sm font-bold text-[#05B6C4] block text-center">
                          {new Date(event.date).toLocaleDateString('nl-NL', { day: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-600 block text-center uppercase">
                          {new Date(event.date).toLocaleDateString('nl-NL', { month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#05B6C4] transition-colors line-clamp-2 min-h-[3.5rem]">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.location}
                        </span>
                        <span className="text-[#05B6C4] font-semibold">Meer info →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Binnenkort meer evenementen!</p>
            </div>
          )}
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Wat Ons Drijft
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Onze missie, visie en waarden vormen de basis van alles wat we doen
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Onze Missie',
                description: 'We bouwen bruggen tussen culturen en generaties. Door educatie, ontmoeting en samenwerking creëren we kansen voor iedereen.',
                icon: Target,
                gradient: 'from-[#05B6C4] to-[#3B87BE]',
              },
              {
                title: 'Onze Visie',
                description: 'Een inclusieve samenleving waar iedereen zich welkom voelt, kan groeien en bijdraagt aan een betere toekomst.',
                icon: Heart,
                gradient: 'from-[#3B87BE] to-[#99D8E0]',
              },
              {
                title: 'Onze Waarden',
                description: 'Inclusiviteit, respect en samenwerking staan centraal. We geloven in de kracht van diversiteit en community.',
                icon: Award,
                gradient: 'from-[#B37B83] to-[#F7941D]',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/over"
              className="inline-flex items-center gap-2 text-[#05B6C4] font-semibold text-lg hover:gap-3 transition-all"
            >
              Lees meer over ons
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Onze Impact in Cijfers
            </h2>
            <p className="text-xl text-white/90">
              Samen maken we het verschil
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Deelnemers Bereikt' },
              { value: '50+', label: 'Evenementen Georganiseerd' },
              { value: '20+', label: 'Actieve Vrijwilligers' },
              { value: '10+', label: 'Jaar Ervaring' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultuur & Educatiecentrum Section */}
      <CultuurEducatieSection />

      {/* Carrièrecentrum Section */}
      <CarrierecentrumSection />

      {/* CTA Section - Donate */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#F7941D] via-[#F7941D] to-[#B37B83] rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <Heart className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Steun Ons Werk
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
                Jouw donatie helpt ons om meer programma's en activiteiten te organiseren voor onze gemeenschap. Samen maken we impact!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/doneren"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#F7941D] px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <Heart className="w-6 h-6" />
                  Doneer Nu
                </Link>
                <Link
                  href="/over"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                >
                  Meer over ANBI
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        pageContext="Homepage"
      />
    </div>
  );
}
