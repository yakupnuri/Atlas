'use client'

import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

export default function ScheduleSection({ schedule, loading }) {
  const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!schedule || schedule.length === 0) {
    return null;
  }

  // Map Turkish days to Dutch
  const dayMapping = {
    'Pazartesi': 'Maandag',
    'Salı': 'Dinsdag',
    'Çarşamba': 'Woensdag',
    'Perşembe': 'Donderdag',
    'Cuma': 'Vrijdag',
    'Cumartesi': 'Zaterdag',
    'Pazar': 'Zondag'
  };

  // Group by day
  const groupedSchedule = days.map(day => {
    // Find Turkish equivalent
    const turkishDay = Object.keys(dayMapping).find(key => dayMapping[key] === day);
    return {
      day,
      items: schedule.filter(item => 
        item.day === day || item.day === turkishDay
      ).sort((a, b) => a.time.localeCompare(b.time))
    };
  }).filter(group => group.items.length > 0);

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900">Lesrooster</h2>
          </div>
          <div className="relative z-10">
            <ShareButtons 
              title="Lesrooster - Cultuur & Educatiecentrum"
              description="Bekijk ons wekelijks lesrooster"
              variant="dropdown"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupedSchedule.map(({ day, items }, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
              style={{ overflow: 'visible' }}
            >
              <h3 className="font-bold text-lg text-indigo-600 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {day}
              </h3>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id || idx} className="bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="font-bold text-indigo-600 text-sm">{item.time}</span>
                      <span className="font-semibold text-gray-900 text-sm">{item.subject}</span>
                    </div>
                    {item.instructor && (
                      <p className="text-xs text-gray-600">Docent: {item.instructor}</p>
                    )}
                    {item.room && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.room}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
