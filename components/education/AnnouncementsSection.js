'use client'

import { motion } from 'framer-motion';
import { Bell, Clock } from 'lucide-react';

export default function AnnouncementsSection({ announcements, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">Aankondigingen</h2>
        </div>
        
        <div className="space-y-4">
          {announcements.slice(0, 5).map((announcement, index) => (
            <motion.div
              key={announcement.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
              {announcement.date && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(announcement.date).toLocaleDateString('nl-NL')}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
