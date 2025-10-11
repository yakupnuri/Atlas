'use client'

import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const team = [
    { name: 'Ahmet Yılmaz', role: 'Kurucu Başkan', image: 'https://i.pravatar.cc/300?img=12' },
    { name: 'Fatma Demir', role: 'Program Koordinatörü', image: 'https://i.pravatar.cc/300?img=5' },
    { name: 'Mehmet Kaya', role: 'Eğitim Sorumlusu', image: 'https://i.pravatar.cc/300?img=33' },
    { name: 'Ayşe Öztürk', role: 'Etkinlik Yöneticisi', image: 'https://i.pravatar.cc/300?img=9' },
  ];

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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Misyonumuz</h2>
            <p className="text-gray-600 leading-relaxed">
              Erişilebilir programlar ve buluşmalar yoluyla kültürler ve nesiller arasında köprüler kuruyoruz. 
              Herkesin kendini hoş karşılandığı ve değerli hissettiği bir topluluk oluşturmayı hedefliyoruz.
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vizyonumuz</h2>
            <p className="text-gray-600 leading-relaxed">
              Herkesin kendini hoş karşılandığı ve büyüme ve gelişme fırsatına sahip olduğu bir toplum. 
              Kültürel çeşitliliğin bir zenginlik kaynağı olarak görüldüğü bir dünya.
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Kapsayıcılık', desc: 'Herkes bizimle hoş karşılanır' },
              { title: 'Saygı', desc: 'Tüm kültürlere eşit saygı' },
              { title: 'İşbirliği', desc: 'Birlikte daha güçlüyüz' },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#F7941D] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
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
