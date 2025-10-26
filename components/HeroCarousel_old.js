'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Heart, Sparkles } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Samen bouwen aan een inclusieve gemeenschap',
    subtitle: 'Stichting Atlas brengt mensen samen door cultuur, educatie en gemeenschapsactiviteiten.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920',
    cta1: { text: 'Bekijk Evenementen', href: '/events' },
    cta2: { text: 'Doneer Nu', href: '/doneren' },
  },
  {
    id: 2,
    title: 'Ramazan İftar Programı',
    subtitle: 'Toplumumuz için özel iftar yemekleri düzenliyoruz. Herkes davetlidir!',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1920',
    cta1: { text: 'Daha Fazla Bilgi', href: '/events' },
    cta2: null,
  },
  {
    id: 3,
    title: 'Ders Yemeği Etkinliği',
    subtitle: 'Öğrenciler ve aileler için eğitici yemek programı düzenlendi.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920',
    cta1: { text: 'Kayıt Ol', href: '/reserveren' },
    cta2: null,
  },
  {
    id: 4,
    title: 'Weekendonderwijs - Culturele Lessen',
    subtitle: 'Kinderen leren hun culturele achtergrond kennen in onze weekendschool.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920',
    cta1: { text: 'Inschrijven', href: '/events' },
    cta2: null,
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const currentSlide = slides[currentIndex];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative bg-gradient-to-r from-[#05B6C4] via-[#3B87BE] to-[#99D8E0] text-white overflow-hidden">
      <div className="relative h-[500px] md:h-[600px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-3xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">ANBI erkend</span>
                </motion.div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {currentSlide.title}
                </h1>

                <p className="text-lg md:text-xl mb-8 text-white/90">
                  {currentSlide.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {currentSlide.cta1 && (
                    <Link
                      href={currentSlide.cta1.href}
                      className="inline-flex items-center justify-center gap-2 bg-white text-[#05B6C4] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      <Calendar className="w-5 h-5" />
                      {currentSlide.cta1.text}
                    </Link>
                  )}

                  {currentSlide.cta2 && (
                    <Link
                      href={currentSlide.cta2.href}
                      className="inline-flex items-center justify-center gap-2 bg-[#F7941D] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#E88610] transition-colors shadow-lg"
                    >
                      <Heart className="w-5 h-5" />
                      {currentSlide.cta2.text}
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
