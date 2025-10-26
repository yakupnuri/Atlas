'use client'

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      const activeSlides = (data.slides || [])
        .filter(s => s.isActive)
        .sort((a, b) => a.order - b.order);
      setSlides(activeSlides);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="relative h-[500px] bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[500px] bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] flex items-center justify-center text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welkom bij Stichting Atlas</h1>
          <p className="text-xl">Samen bouwen aan een inclusieve gemeenschap</p>
        </div>
      </section>
    );
  }

  const current = slides[currentIndex];
  if (!current) return null;

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      {current.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${current.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
      )}
      
      {/* No Image Fallback */}
      {!current.image && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE]"></div>
      )}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-3xl text-white">
          {current.subtitle && (
            <p className="text-lg md:text-xl mb-4 text-blue-100">{current.subtitle}</p>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {current.title}
          </h1>
          
          {current.description && (
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              {current.description}
            </p>
          )}
          
          {current.ctaText && current.ctaLink && (
            <Link
              href={current.ctaLink}
              className="inline-block px-8 py-4 bg-white text-[#05B6C4] font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg text-lg"
            >
              {current.ctaText}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
