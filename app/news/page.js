'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const newsItems = [
  {
    id: 1,
    title: 'Ramazan İftar Programı Başarıyla Tamamlandı',
    slug: 'ramazan-iftar-programi-basariyla-tamamlandi',
    excerpt: 'Bu yılki Ramazan ayında düzenlediğimiz iftar programlarına 150\'den fazla kişi katıldı.',
    date: '2025-04-15',
    author: 'Fatma Demir',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800',
    category: 'Etkinlik',
  },
  {
    id: 2,
    title: 'Yeni Ders Yemeği Programı Başlıyor',
    slug: 'yeni-ders-yemegi-programi-basliyor',
    excerpt: 'Öğrenciler ve aileler için her Cumartesi düzenlenen eğitici yemek programımız başlıyor.',
    date: '2025-03-22',
    author: 'Mehmet Kaya',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    category: 'Eğitim',
  },
  {
    id: 3,
    title: 'Weekendonderwijs Kayıtları Başladı',
    slug: 'weekendonderwijs-kayitlari-basladi',
    excerpt: 'Hafta sonu okulumuzun yeni dönemi için kayıtlar açıldı. Şimdi kaydolun!',
    date: '2025-03-10',
    author: 'Ayşe Öztürk',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    category: 'Eğitim',
  },
  {
    id: 4,
    title: 'Soepdag - 100. Etkinlik Kutlaması',
    slug: 'soepdag-100-etkinlik-kutlamasi',
    excerpt: 'Her hafta düzenlediğimiz Soepdag programının 100. etkinliğini kutladık!',
    date: '2025-02-28',
    author: 'Ahmet Yılmaz',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    category: 'Etkinlik',
  },
  {
    id: 5,
    title: 'Yeni Gönüllüler Arıyoruz',
    slug: 'yeni-gonulluler-ariyoruz',
    excerpt: 'Etkinliklerimizde görev almak isteyen gönüllüleri aramaya başladık.',
    date: '2025-02-15',
    author: 'Fatma Demir',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    category: 'Duyuru',
  },
  {
    id: 6,
    title: 'ANBI Statüsü Yenilendi',
    slug: 'anbi-statusu-yenilendi',
    excerpt: 'Stichting Atlas\'un ANBI statüsü başarıyla yenilendi.',
    date: '2025-01-20',
    author: 'Ahmet Yılmaz',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    category: 'Duyuru',
  },
];

export default function NewsPage() {
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'Etkinlik', 'Eğitim', 'Duyuru'];

  const filteredNews = filter === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Haberler
            </h1>
            <p className="text-xl text-white/90">
              Stichting Atlas'tan son haberler ve duyurular
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filter === cat
                    ? 'bg-[#05B6C4] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Tümü' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 right-4 bg-[#F7941D] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {item.author}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {item.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p>

                <Link
                  href={`/news/${item.slug}`}
                  className="text-[#05B6C4] hover:text-[#3B87BE] font-semibold flex items-center gap-2"
                >
                  Devamını Oku
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
