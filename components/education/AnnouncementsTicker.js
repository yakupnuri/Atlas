'use client'

import { Bell } from 'lucide-react';

export default function AnnouncementsTicker({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  // Show only last 5 announcements
  const recentAnnouncements = announcements.slice(0, 5);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm uppercase">Aankondigingen</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {recentAnnouncements.map((announcement, index) => (
              <div 
                key={announcement.id}
                className="flex items-center gap-3"
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
      </div>
    </div>
  );
}
