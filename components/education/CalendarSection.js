'use client'

import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

export default function CalendarSection({ events, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return null;
  }

  const getTypeColor = (type) => {
    switch(type) {
      case 'holiday': return 'bg-red-100 text-red-700 border-red-300';
      case 'exam': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'event': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'registration': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'holiday': return 'Vakantie';
      case 'exam': return 'Examen';
      case 'event': return 'Evenement';
      case 'registration': return 'Inschrijving';
      default: return type;
    }
  };

  // Sort by date and show only upcoming/recent events
  const sortedEvents = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-900">Belangrijke Data</h2>
        </div>
        
        <div className="space-y-4">
          {sortedEvents.map((event, index) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-2 rounded-lg p-4 ${getTypeColor(event.type)}`}
              style={{ overflow: 'visible', position: 'relative' }}
            >
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-bold text-lg">
                      {new Date(event.date).toLocaleDateString('nl-NL', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold">
                      {getTypeText(event.type)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                  )}
                  <div className="relative z-10">
                    <ShareButtons 
                      title={event.title}
                      description={event.description}
                      variant="dropdown"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
