'use client'

import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

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
            <motion.a
              key={doc.id || index}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group border border-gray-200 rounded-lg p-5 hover:shadow-xl hover:border-green-500 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors flex-shrink-0">
                  <Download className="w-6 h-6 text-green-600 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
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
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
