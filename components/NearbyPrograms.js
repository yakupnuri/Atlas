'use client'

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';

const programs = [
  {
    id: 1,
    title: 'Ramazan İftar Programı',
    description: 'Toplumumuz için özel iftar yemekleri düzenliyoruz',
    date: '2025 Ramazan',
    location: 'Gemeenschapshuis De Brug',
    participants: '150+ kişi',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: 'Ders Yemeği Etkinliği',
    description: 'Öğrenciler ve aileler için eğitici yemek programı',
    date: 'Her Cumartesi',
    location: 'Atlas Cultuurcentrum',
    participants: '50+ öğrenci',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: 'Soepdag Program',
    description: 'Gratis soep en gezelligheid voor iedereen',
    date: 'Elke donderdag',
    location: 'Gemeenschapshuis',
    participants: 'Iedereen welkom',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    color: 'from-orange-500 to-red-500',
  },
];

export default function NearbyPrograms() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Yakındaki Programlar
          </motion.h2>
          <p className="text-gray-600 text-lg">
            Düzenli olarak yapılan etkinliklerimiz ve programlarımız
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-60`}></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {program.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {program.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-[#05B6C4]" />
                    {program.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-[#05B6C4]" />
                    {program.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-[#05B6C4]" />
                    {program.participants}
                  </div>
                </div>

                <Link
                  href="/events"
                  className="block w-full text-center bg-[#05B6C4] hover:bg-[#3B87BE] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Detayları Gör
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
