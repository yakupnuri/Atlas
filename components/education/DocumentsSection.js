'use client'

import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

export default function DocumentsSection({ documents, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900">Documenten</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.slice(0, 6).map((doc, index) => (
            <motion.div
              key={doc.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-xl hover:border-green-500 transition-all"
              style={{ overflow: 'visible' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors flex-shrink-0">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{doc.description}</p>
                  )}
                  {doc.category && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {doc.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <div className="relative z-10">
                  <ShareButtons 
                    title={doc.title}
                    description={doc.description}
                    url={doc.url}
                    variant="dropdown"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
