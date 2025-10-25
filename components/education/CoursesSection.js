'use client'

import { motion } from 'framer-motion';
import { BookOpen, Clock, Users } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

export default function CoursesSection({ courses, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return null;
  }

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelText = (level) => {
    switch(level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Gemiddeld';
      case 'advanced': return 'Gevorderd';
      default: return level;
    }
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-teal-500" />
          <h2 className="text-2xl font-bold text-gray-900">Cursussen</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-xl hover:border-teal-500 transition-all"
              style={{ overflow: 'visible' }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-gray-900 flex-1">{course.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                  {getLevelText(course.level)}
                </span>
              </div>
              
              {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              )}
              
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-500" />
                    <span><strong>Docent:</strong> {course.instructor}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span><strong>Duur:</strong> {course.duration}</span>
                  </div>
                )}
                {course.schedule && (
                  <p><strong>Schema:</strong> {course.schedule}</p>
                )}
                {course.price && (
                  <p className="text-lg font-bold text-teal-600 mt-2">{course.price}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 relative z-10">
                <ShareButtons 
                  title={course.title}
                  description={course.description}
                  variant="dropdown"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
