'use client'

import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

export default function ValuesSection({ values }) {
  const defaultValues = [
    { title: 'Inclusiviteit', description: 'Iedereen is welkom bij ons' },
    { title: 'Respect', description: 'Gelijke waardering voor alle culturen' },
    { title: 'Samenwerking', description: 'Samen zijn we sterker' },
    { title: 'Innovatie', description: 'Blijven leren en verbeteren' }
  ];

  const displayValues = values?.length > 0 ? values : defaultValues;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-center mb-12">
            <Award className="w-12 h-12 text-[#05B6C4] mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Onze Waarden</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayValues.map((value, index) => (
              <motion.div
                key={value.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-[#05B6C4] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
