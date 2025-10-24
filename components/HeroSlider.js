'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Auto-advance every 5 seconds

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      
      if (data.slides && data.slides.length > 0) {
        // Filter only active slides
        const activeSlides = data.slides.filter(slide => slide.isActive);
        setSlides(activeSlides);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section className="relative min-h-[50vh] flex items-center bg-gray-200 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="h-32 bg-gray-300 rounded-lg w-1/2"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    // Fallback to default hero if no slides
    return (
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05B6C4]/95 via-[#3B87BE]/90 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Samen Bouwen Aan Een
              <span className="block text-yellow-300">Inclusieve Toekomst</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
              Een gemeenschap waar culturen samenkomen, kennis wordt gedeeld en iedereen de kans krijgt om te groeien.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 z-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {slide.badge && (
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 text-sm font-medium">
                  {slide.badge}
                </div>
              )}
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {slide.title}
              </h1>
              
              {slide.description && (
                <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                  {slide.description}
                </p>
              )}

              {/* CTA Buttons */}
              {slide.ctaText && slide.ctaLink && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={slide.ctaLink || '#'}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#05B6C4] px-6 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
