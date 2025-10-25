'use client'

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

export default function AnnouncementsTicker({ announcements }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!announcements || announcements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm uppercase">Aankondiging</span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div 
              className="whitespace-nowrap transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                display: 'flex'
              }}
            >
              {announcements.map((announcement, index) => (
                <div 
                  key={announcement.id || index}
                  className="inline-flex items-center gap-2 min-w-full px-4"
                >
                  <span className="font-semibold">{announcement.title}</span>
                  {announcement.date && (
                    <span className="text-sm opacity-90">
                      • {new Date(announcement.date).toLocaleDateString('nl-NL')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Indicator dots */}
          {announcements.length > 1 && (
            <div className="flex gap-2 flex-shrink-0">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to announcement ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
