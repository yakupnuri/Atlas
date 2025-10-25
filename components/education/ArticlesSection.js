'use client'

import { motion } from 'framer-motion';
import { Newspaper, User, Calendar } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

export default function ArticlesSection({ articles, loading }) {
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

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Artikelen</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.slice(0, 4).map((article, index) => (
            <motion.div
              key={article.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  {article.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </span>
                  )}
                  {article.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('nl-NL')}
                    </span>
                  )}
                </div>

                <ShareButtons 
                  title={article.title}
                  description={article.excerpt}
                  variant="inline"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
