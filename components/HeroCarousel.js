'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides');
        const data = await response.json();
        const activeSlides = (data.slides || [])
          .filter(slide => slide.isActive)
          .sort((a, b) => a.order - b.order);
        setSlides(activeSlides);
      } catch (error) {
        console.error('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const handleNext = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext, slides.length]);

  if (loading) {
    return (
      <section className="relative bg-gradient-to-r from-[#05B6C4] via-[#3B87BE] to-[#99D8E0] text-white">
        <div className="container mx-auto px-4 py-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative bg-gradient-to-r from-[#05B6C4] via-[#3B87BE] to-[#99D8E0] text-white">
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-4xl font-bold mb-4">Welkom bij Stichting Atlas</h2>
          <p className="text-xl text-blue-100">Samen bouwen aan een inclusieve gemeenschap</p>
        </div>
      </section>
    );
  }

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
      <div className="absolute inset-0 bg-black/20"></div>
      
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="relative"
        >
          {currentSlide.image && (
            <div className="absolute inset-0 z-0">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
          )}

          <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl">
              {/* Badge */}
              {currentSlide.badge?.enabled && currentSlide.badge?.text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <span className={`inline-block px-4 py-2 text-sm font-bold rounded-full shadow-lg ${
                    (currentSlide.badge.color || 'blue') === 'blue' ? 'bg-blue-500 text-white' :
                    currentSlide.badge.color === 'green' ? 'bg-green-500 text-white' :
                    currentSlide.badge.color === 'red' ? 'bg-red-500 text-white' :
                    currentSlide.badge.color === 'yellow' ? 'bg-yellow-400 text-gray-900' :
                    currentSlide.badge.color === 'purple' ? 'bg-purple-500 text-white' :
                    'bg-pink-500 text-white'
                  }`}>
                    {String(currentSlide.badge.text)}
                  </span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              >
                {currentSlide.title}
              </motion.h1>

              {currentSlide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-blue-100 mb-6"
                >
                  {currentSlide.subtitle}
                </motion.p>
              )}

              {currentSlide.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-base md:text-lg text-blue-50 mb-8"
                >
                  {currentSlide.description}
                </motion.p>
              )}

              {currentSlide.ctaText && currentSlide.ctaLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    href={currentSlide.ctaLink}
                    className="inline-flex items-center px-6 py-3 bg-white text-[#05B6C4] font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                  >
                    {currentSlide.ctaText}
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
      )}
    </section>
  );
}
