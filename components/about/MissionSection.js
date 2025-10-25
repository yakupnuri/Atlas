'use client'

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function MissionSection({ content }) {
  const defaultItems = [
    'Toegankelijke en impactvolle educatieve programma\'s en informatieve bijeenkomsten organiseren',
    'Projecten ontwikkelen die interculturele dialoog en ontmoeting bevorderen',
    'Participatie en integratie van nieuwkomers en andere kwetsbare groepen ondersteunen',
    'Activiteiten opzetten voor jongeren, volwassenen en ouderen, afgestemd op hun behoeften',
    'Lokale betrokkenheid en gemeenschapszin versterken via laagdrempelige initiatieven'
  ];

  const items = content?.items?.length > 0 ? content.items : defaultItems;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-8">
            <Target className="w-12 h-12 text-[#05B6C4] mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Onze Missie</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {content?.content && (
              <p className="text-gray-700 leading-relaxed mb-6 text-center italic">
                {content.content}
              </p>
            )}
            
            <ul className="space-y-4">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <span className="text-[#05B6C4] font-bold text-xl mr-3 flex-shrink-0">•</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
