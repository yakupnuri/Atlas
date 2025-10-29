'use client'

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function AnnouncementsTicker({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  // Duplicate announcements for seamless loop (like EventTicker)
  const duplicatedAnnouncements = [...announcements, ...announcements, ...announcements];

  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white py-3 overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <div className="container mx-auto px-4">
          <span className="text-sm font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 animate-pulse" />
            Aankondigingen
          </span>
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
          {duplicatedAnnouncements.map((announcement, index) => (
            <div
              key={`${announcement.id}-${index}`}
              className="flex items-center gap-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
            >
              <Bell className="w-4 h-4 flex-shrink-0" />
              <div className="flex items-center gap-4">
                <span className="font-semibold">{announcement.title}</span>
                {announcement.date && (
                  <span className="text-white/80 text-sm">
                    {(() => {
                      try {
                        const eventDate = new Date(announcement.date);
                        if (isNaN(eventDate.getTime())) return '';
                        return format(eventDate, 'd MMM', { locale: nl });
                      } catch (e) {
                        return '';
                      }
                    })()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

