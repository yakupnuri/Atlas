'use client'

import { motion } from 'framer-motion';
import { Heart, Shield, CheckCircle } from 'lucide-react';

export default function DonerenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#B37B83] to-[#F7941D] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Steun Ons Werk
            </h1>
            <p className="text-xl text-white/90">
              Jouw donatie maakt het verschil voor onze gemeenschap
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 shadow-md mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Waarom doneren aan Stichting Atlas?
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Met jouw steun kunnen wij blijven werken aan een inclusieve gemeenschap waar iedereen zich welkom voelt. 
              Jouw donatie helpt ons om evenementen te organiseren, educatieve programma's aan te bieden en mensen samen te brengen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Gratis Evenementen', description: 'Toegankelijke activiteiten voor iedereen' },
                { title: 'Educatie Programma\'s', description: 'Weekendonderwijs en culturele lessen' },
                { title: 'Gemeenschapswerk', description: 'Verbinding en ondersteuning' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <CheckCircle className="w-8 h-8 text-[#05B6C4] mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ANBI Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">ANBI Erkend</h3>
                <p className="text-sm text-gray-600">
                  Stichting Atlas is erkend als ANBI (Algemeen Nut Beogende Instelling). 
                  Dit betekent dat jouw donatie fiscaal aftrekbaar kan zijn.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Donation Form Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-8 shadow-md text-center"
          >
            <Heart className="w-16 h-16 text-[#F7941D] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Donatie Systeem
            </h2>
            <p className="text-gray-600 mb-6">
              Stripe betalingsintegratie wordt in Fase 3 geïmplementeerd.
            </p>
            <div className="inline-block bg-gray-100 text-gray-600 px-6 py-3 rounded-lg">
              Binnenkort beschikbaar
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
