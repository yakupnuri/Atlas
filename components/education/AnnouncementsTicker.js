'use client'

import { Bell } from 'lucide-react';

export default function AnnouncementsTicker({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  // Duplicate announcements for seamless loop
  const duplicatedAnnouncements = [...announcements, ...announcements];

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 shadow-lg overflow-hidden">
      <div className="flex items-center">
        <div className="flex items-center gap-2 px-4 flex-shrink-0">
          <Bell className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm uppercase">Aankondiging</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="ticker-wrapper">
            <div className="ticker-content">
              {duplicatedAnnouncements.map((announcement, index) => (
                <span 
                  key={`${announcement.id}-${index}`}
                  className="ticker-item inline-flex items-center gap-2 px-8"
                >
                  <span className="font-semibold">{announcement.title}</span>
                  {announcement.date && (
                    <span className="text-sm opacity-90">
                      • {new Date(announcement.date).toLocaleDateString('nl-NL')}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticker-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .ticker-content {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll-left 30s linear infinite;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause on hover */
        .ticker-wrapper:hover .ticker-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
