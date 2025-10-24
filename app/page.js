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
  CheckCircle
} from 'lucide-react';
import ContactModal from '@/components/ContactModal';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);

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
        .slice(0, 3);
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
      {/* Hero Section - Reduced Height */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05B6C4]/95 via-[#3B87BE]/90 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-white/90 font-medium">Welkom bij Stichting Atlas</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Samen Bouwen Aan Een
                <span className="block text-yellow-300">Inclusieve Toekomst</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                Een gemeenschap waar culturen samenkomen, kennis wordt gedeeld en iedereen de kans krijgt om te groeien.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/academie"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#05B6C4] px-6 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <GraduationCap className="w-5 h-5" />
                  Ontdek Atlas Academie
                </Link>
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
                >
                  Neem Contact Op
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>ANBI Erkend</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>500+ Deelnemers</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>10+ Jaar Ervaring</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-16">
            <path
              fill="#ffffff"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* News Highlight + Mission/Vision/Values Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: News Section - 2 columns */}
          <div className="lg:col-span-2">
            {latestNews.length > 0 ? (
              <div className="space-y-6">
                {/* Big Main News */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <Link href={`/nieuws/${latestNews[0]?.slug}`}>
                    <div className="relative h-[400px]">
                      <img
                        src={latestNews[0]?.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'}
                        alt={latestNews[0]?.title}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase">
                          {latestNews[0]?.category || 'Nieuws'}
                        </span>
                      </div>
                      
                      {/* Title and description */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                          {latestNews[0]?.title}
                        </h2>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {latestNews[0]?.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Small News Boxes with Hover Effect */}
                {latestNews.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {latestNews.slice(0, 4).map((news, index) => (
                      <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105"
                      >
                        <Link href={`/nieuws/${news.slug}`}>
                          <div className="relative h-32">
                            <img
                              src={news.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300'}
                              alt={news.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl shadow-lg h-full flex items-center justify-center p-8">
                <p className="text-gray-500 text-lg">Geen nieuws beschikbaar</p>
              </div>
            )}
          </div>

          {/* Right: Mission/Vision/Values - 1 column */}
          <div className="lg:col-span-1 space-y-4">
            {[
              {
                title: 'Onze Missie',
                description: 'We bouwen bruggen tussen culturen en generaties.',
                icon: Target,
                color: 'from-[#05B6C4] to-[#3B87BE]',
              },
              {
                title: 'Onze Visie',
                description: 'Een inclusieve samenleving waar iedereen zich welkom voelt.',
                icon: Heart,
                color: 'from-[#3B87BE] to-[#99D8E0]',
              },
              {
                title: 'Onze Waarden',
                description: 'Inclusiviteit, respect en samenwerking staan centraal.',
                icon: Award,
                color: 'from-[#B37B83] to-[#F7941D]',
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  <Link 
                    href="/over" 
                    className="inline-flex items-center text-[#05B6C4] hover:text-[#3B87BE] font-semibold text-sm transition-colors"
                  >
                    Lees meer
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
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
                >
                  <Link
                    href={program.href}
                    className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden">
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
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#05B6C4] transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
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

      {/* Upcoming Events Section */}
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
                    className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                        <span className="text-sm font-bold text-[#05B6C4]">
                          {new Date(event.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#05B6C4] transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{event.location}</span>
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

      {/* Latest News Section */}
      {latestNews.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                    <Newspaper className="w-5 h-5" />
                    <span className="font-semibold">Nieuws</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Laatste Nieuws
                  </h2>
                  <p className="text-xl text-gray-600">
                    Blijf op de hoogte van onze activiteiten en ontwikkelingen
                  </p>
                </motion.div>
              </div>
              <Link
                href="/nieuws"
                className="hidden md:inline-flex items-center gap-2 text-[#05B6C4] font-semibold hover:gap-3 transition-all"
              >
                Bekijk alle nieuws
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link
                    href={`/nieuws/${news.slug}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={news.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                          {news.category || 'Nieuws'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(news.publishDate).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#05B6C4] transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {news.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
