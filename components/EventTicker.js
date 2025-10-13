'use client'

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import Link from 'next/link';

export default function EventTicker({ events }) {
  // Duplicate events for seamless loop
  const duplicatedEvents = [...events, ...events, ...events];

  return (
    <div className="bg-gradient-to-r from-[#05B6C4] via-[#3B87BE] to-[#05B6C4] text-white py-3 overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <div className="container mx-auto px-4">
          <span className="text-sm font-semibold">🔔 Aankomende Evenementen</span>
        </div>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedEvents.map((event, index) => (
            <Link
              key={`${event.id}-${index}`}
              href={`/events/${event.slug}`}
              className="flex items-center gap-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <div className="flex items-center gap-4">
                <span className="font-semibold">{event.title}</span>
                <span className="text-white/80 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.locationName}
                </span>
                <span className="text-white/80 text-sm">
                  {event.startAt || event.date ? (
                    format(new Date(event.startAt || event.date), 'd MMM', { locale: nl })
                  ) : (
                    'Datum TBA'
                  )}
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
