'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventCard from '@/components/EventCard';
import EventTicker from '@/components/EventTicker';
import { Filter } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Alle' },
    { value: 'soepdag', label: 'Soepdag' },
    { value: 'educatie', label: 'Educatie' },
    { value: 'festival', label: 'Festival' },
    { value: 'vrouwen-gezin', label: 'Vrouwen & Gezin' },
  ];

  useEffect(() => {
    fetchEvents();
    fetchUpcomingForTicker();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'all' 
        ? '/api/events?upcoming=true'
        : `/api/events?category=${selectedCategory}&upcoming=true`;
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingForTicker = async () => {
    try {
      const response = await fetch('/api/events?upcoming=true');
      const data = await response.json();
      setUpcomingEvents(data.events.slice(0, 5)); // Get first 5 upcoming
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Evenementen
            </h1>
            <p className="text-xl text-white/90">
              Ontdek al onze aankomende activiteiten en schrijf je in!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-gray-600 font-medium whitespace-nowrap">
              <Filter className="w-5 h-5" />
              <span>Filter:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-[#05B6C4] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event Ticker */}
      {upcomingEvents.length > 0 && (
        <EventTicker events={upcomingEvents} />
      )}

      {/* Events Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">
              Geen evenementen gevonden voor deze categorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
