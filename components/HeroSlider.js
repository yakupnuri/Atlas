'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      
      if (data.slides && data.slides.length > 0) {
        // Filter only active slides and ensure id exists
        const activeSlides = data.slides
          .filter(slide => slide.isActive)
          .map((slide, index) => ({
            ...slide,
            id: slide.id || `slide-${index}` // Ensure id exists
          }));
        setSlides(activeSlides);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(handleNext, 6000); // 6 seconds auto-advance
      return () => clearInterval(interval);
    }
  }, [handleNext, slides.length]);

  if (loading) {
    return (
      <section className="relative bg-gradient-to-r from-[#05B6C4] via-[#3B87BE] to-[#99D8E0] text-white overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
          <div className="animate-pulse text-2xl font-bold">Laden...</div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    // Fallback to default hero if no slides
    return (
      <section className="relative bg-gradient-to-r from-[#05B6C4] via-[#3B87BE] to-[#99D8E0] text-white overflow-hidden">
        <div className="relative h-[500px] md:h-[600px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920"
              alt="Community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05B6C4]/95 via-[#3B87BE]/90 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-4 md:px-8 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-white/90 font-medium">Welkom bij Stichting Atlas</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Samen Bouwen Aan Een
                <span className="block text-yellow-300">Inclusieve Toekomst</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                Een gemeenschap waar culturen samenkomen, kennis wordt gedeeld en iedereen de kans krijgt om te groeien.
              </p>
            </motion.div>
          </div>
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
            <div className="relative container mx-auto px-4 md:px-8 h-full flex items-center">
              <div className="max-w-3xl">
                {currentSlide.badge && typeof currentSlide.badge === 'object' && currentSlide.badge.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-white/90 font-medium">{String(currentSlide.badge.text)}</span>
                  </motion.div>
                )}
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
                >
                  {currentSlide.title}
                </motion.h1>
                
                {currentSlide.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed"
                  >
                    {currentSlide.description}
                  </motion.p>
                )}

                {/* CTA Button */}
                {currentSlide.ctaText && currentSlide.ctaLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <Link
                      href={currentSlide.ctaLink}
                      className="inline-flex items-center justify-center gap-2 bg-white text-[#05B6C4] px-6 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
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
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
