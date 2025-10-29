'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, RefreshCw, Mail } from 'lucide-react';

export default function MaintenancePage() {
  const [message, setMessage] = useState('Deze website is momenteel in onderhoud. We zijn binnenkort terug!');
  const [estimatedTime, setEstimatedTime] = useState('');

  useEffect(() => {
    fetchMaintenanceInfo();
  }, []);

  const fetchMaintenanceInfo = async () => {
    try {
      const response = await fetch('/api/maintenance');
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setEstimatedTime(data.estimatedTime);
      }
    } catch (error) {
      console.error('Error fetching maintenance info:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Stichting Atlas" 
            className="w-24 h-24 mx-auto mb-6 rounded-xl shadow-lg"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Stichting Atlas
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] rounded-full flex items-center justify-center">
              <Wrench className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Website in Onderhoud
          </h2>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {estimatedTime && (
            <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-semibold">
                {estimatedTime}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Opnieuw Proberen
            </button>
            
            <a
              href="mailto:info@stichtingatlas.com"
              className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-[#05B6C4] hover:text-[#05B6C4] transition-all"
            >
              <Mail className="w-5 h-5" />
              Contact Opnemen
            </a>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Bedankt voor uw geduld!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 Stichting Atlas. Alle rechten voorbehouden.</p>
        </div>
      </motion.div>
    </div>
  );
}
