'use client'

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function VisionSection({ content }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-12 h-12 text-[#05B6C4] mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Onze Visie</h2>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg shadow-md p-8">
            <p className="text-gray-700 leading-relaxed text-center">
              {content?.content || 'Wij geloven in een samenleving waarin respect, tolerantie en culturele diversiteit als fundamentele waarden gelden. Stichting Atlas wil bijdragen aan sociale cohesie, actief burgerschap en gedeelde toekomstperspectieven. Door middel van educatie, ontmoeting en samenwerking creëren wij ruimte voor dialoog en persoonlijke ontwikkeling.'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
