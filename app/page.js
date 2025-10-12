'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Target, Heart, Award } from 'lucide-react';
import EventCard from '@/components/EventCard';
import HeroCarousel from '@/components/HeroCarousel';
import NearbyPrograms from '@/components/NearbyPrograms';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/admin/about');
      const data = await response.json();
      setAboutContent(data.content);
    } catch (error) {
      console.error('Error fetching about content:', error);
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

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Mission/Vision/Values Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg mb-4 flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 min-h-[3rem]">{item.description}</p>
                
                <Link 
                  href="/over" 
                  className="inline-flex items-center text-[#05B6C4] hover:text-[#3B87BE] font-semibold transition-colors"
                >
                  Lees meer
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Nearby Programs */}
      <NearbyPrograms />

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Aankomende Evenementen
            </h2>
            <p className="text-gray-600 text-lg">
              Doe mee met onze activiteiten en ontmoet nieuwe mensen!
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Geen aankomende evenementen gevonden.</p>
              <button
                onClick={async () => {
                  await fetch('/api/seed', { method: 'POST', body: '{}', headers: {'Content-Type': 'application/json'} });
                  fetchUpcomingEvents();
                }}
                className="bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Laad Demo Evenementen
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  href="/evenementen"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Bekijk Alle Evenementen
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Deelnemers' },
              { value: '50+', label: 'Evenementen' },
              { value: '20+', label: 'Vrijwilligers' },
              { value: '5', label: 'Programma\'s' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#B37B83] to-[#F7941D] rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Steun Ons Werk
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Jouw donatie helpt ons om meer programma's en activiteiten te organiseren voor onze gemeenschap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/doneren"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#F7941D] px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Doneer Nu
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
