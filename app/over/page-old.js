'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/admin/about');
      const data = await response.json();
      setContent(data.content);
      setTeam(data.team || []);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hakkımızda
            </h1>
            <p className="text-xl text-white/90">
              Stichting Atlas - Birlikte kapsayıcı bir topluluk inşa ediyoruz
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      {content?.whoWeAre && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{content.whoWeAre.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{content.whoWeAre.content}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg p-8 shadow-md"
          >
            <div className="w-16 h-16 bg-[#05B6C4] rounded-lg mb-6 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{content?.mission?.title || 'Onze Missie'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {content?.mission?.content || 'We bouwen bruggen tussen culturen en generaties.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg p-8 shadow-md"
          >
            <div className="w-16 h-16 bg-[#3B87BE] rounded-lg mb-6 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{content?.vision?.title || 'Onze Visie'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {content?.vision?.content || 'Een samenleving waarin iedereen zich welkom voelt.'}
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg p-8 shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Onze Waarden</h2>
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(content?.values?.length || 3, 4)} gap-6`}>
            {content?.values?.map((value, index) => (
              <div key={value.id} className="text-center">
                <div className="w-12 h-12 bg-[#F7941D] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ekibimiz
            </h2>
            <p className="text-gray-600 text-lg">
              Tutkulu ve adanmış ekibimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#05B6C4]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ANBI */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Award className="w-16 h-16 text-[#05B6C4] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ANBI Onaylı</h2>
            <p className="text-gray-600 leading-relaxed">
              Stichting Atlas, Hollanda'ın ANBI (Algemeen Nut Beogende Instelling) statüsüne sahiptir. 
              Bu, bize yapılan bağışların vergi avantajlarından yararlanabileceği anlamına gelir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg p-8 shadow-md max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">İletişim</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-[#05B6C4]" />
              <span className="text-gray-700">info@stichtingatlas.nl</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-[#05B6C4]" />
              <span className="text-gray-700">Amsterdam, Nederland</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
