'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactModal from '@/components/ContactModal';
import WhoWeAreSection from '@/components/about/WhoWeAreSection';
import MissionSection from '@/components/about/MissionSection';
import VisionSection from '@/components/about/VisionSection';
import ValuesSection from '@/components/about/ValuesSection';
import TeamSection from '@/components/about/TeamSection';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/admin/about');
      const data = await response.json();
      setAboutContent(data.content);
      setTeam(data.team || []);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              Over Ons
            </h1>
            <p className="text-xl opacity-90">
              Samen bouwen we aan een inclusieve en verbonden samenleving
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <WhoWeAreSection content={aboutContent?.whoWeAre} />
      <MissionSection content={aboutContent?.mission} />
      <VisionSection content={aboutContent?.vision} />
      <ValuesSection values={aboutContent?.values} />
      <TeamSection team={team} loading={loading} />

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-6">Wil je meer weten?</h2>
            <p className="text-xl mb-8 opacity-90">
              Neem contact met ons op en ontdek hoe je kunt deelnemen aan onze projecten
            </p>
            <button
              onClick={() => setContactModalOpen(true)}
              className="inline-block bg-white text-[#05B6C4] py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Neem Contact Op
            </button>
          </motion.div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        pageContext="Over Ons"
      />
    </div>
  );
}
