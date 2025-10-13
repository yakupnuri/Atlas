'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function EventCard({ event, index = 0 }) {
  const categoryColors = {
    soepdag: 'bg-orange-100 text-orange-700',
    educatie: 'bg-blue-100 text-blue-700',
    festival: 'bg-purple-100 text-purple-700',
    'vrouwen-gezin': 'bg-pink-100 text-pink-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
          {event.category}
        </span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-[#05B6C4]" />
            {(() => {
              try {
                const dateStr = event.startAt || event.date;
                if (!dateStr) return 'Datum nog niet bekend';
                const eventDate = new Date(dateStr);
                if (isNaN(eventDate.getTime())) return 'Datum nog niet bekend';
                return format(eventDate, 'EEEE d MMMM yyyy, HH:mm', { locale: nl });
              } catch (e) {
                return 'Datum nog niet bekend';
              }
            })()}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-[#05B6C4]" />
            {event.locationName || event.location || 'Locatie nog niet bekend'}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-[#05B6C4]" />
            {event.capacity ? `${event.capacity} plaatsen` : 'Capaciteit niet bekend'}
            {event.available !== undefined && event.available < event.capacity && (
              <span className="ml-2 text-orange-600 font-medium">
                ({event.available} beschikbaar)
              </span>
            )}
          </div>
        </div>
        
        <Link
          href={`/evenementen/${event.slug}`}
          className="block w-full text-center bg-gradient-to-r from-[#05B6C4] to-[#0891A0] hover:shadow-lg text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          Bekijk details
        </Link>
      </div>
    </motion.div>
  );
}
