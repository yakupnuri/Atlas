'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, User } from 'lucide-react';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getPlaceholderImage = (name) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'A';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Atlas')}&size=200&background=05B6C4&color=fff&bold=true`;
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

      {/* Who We Are */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{aboutContent?.whoWeAre?.title || 'Over Stichting Atlas'}</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="leading-relaxed">
                {aboutContent?.whoWeAre?.content || 'Stichting Atlas is een jonge, dynamische organisatie die in 2024 is opgericht door een groep maatschappelijk betrokken nieuwkomers uit Turkije, woonachtig in Leiden en omliggende gemeenten. De stichting is geworteld in het streven naar een inclusieve, verbonden en vreedzame samenleving waarin culturele diversiteit wordt gewaardeerd en waarin iedereen actief kan deelnemen aan het maatschappelijk leven. Met een team van toegewijde vrijwilligers, ervaren projectleiders en betrokken bestuursleden realiseert Atlas sociale, culturele en educatieve projecten die bijdragen aan wederzijds begrip, acceptatie en participatie. Stichting Atlas fungeert als platform waar mensen elkaar ontmoeten, samenwerken en samen groeien.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <Target className="w-12 h-12 text-[#05B6C4] mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Onze Missie</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Mission Description */}
              {aboutContent?.mission?.content && (
                <p className="text-gray-700 leading-relaxed mb-6 text-center italic">
                  {aboutContent.mission.content}
                </p>
              )}
              
              <ul className="space-y-4">
                {aboutContent?.mission?.items?.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#05B6C4] font-bold text-xl mr-3">•</span>
                    <span className="text-gray-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                )) || (
                  <>
                    <li className="flex items-start">
                      <span className="text-[#05B6C4] font-bold text-xl mr-3">•</span>
                      <span className="text-gray-700 leading-relaxed">
                        Toegankelijke en impactvolle educatieve programma's en informatieve bijeenkomsten organiseren
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#05B6C4] font-bold text-xl mr-3">•</span>
                      <span className="text-gray-700 leading-relaxed">
                        Projecten ontwikkelen die interculturele dialoog en ontmoeting bevorderen
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#05B6C4] font-bold text-xl mr-3">•</span>
                      <span className="text-gray-700 leading-relaxed">
                        Participatie en integratie van nieuwkomers en andere kwetsbare groepen ondersteunen
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#05B6C4] font-bold text-xl mr-3">•</span>
                      <span className="text-gray-700 leading-relaxed">
                        Activiteiten opzetten voor jongeren, volwassenen en ouderen, afgestemd op hun behoeften
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#05B6C4] font-bold text-xl mr-3">•</span>
                      <span className="text-gray-700 leading-relaxed">
                        Lokale betrokkenheid en gemeenschapszin versterken via laagdrempelige initiatieven
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <Heart className="w-12 h-12 text-[#05B6C4] mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Onze Visie</h2>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg shadow-md p-8">
              <p className="text-gray-700 leading-relaxed">
                {aboutContent?.vision?.content || 'Wij geloven in een samenleving waarin respect, tolerantie en culturele diversiteit als fundamentele waarden gelden. Stichting Atlas wil bijdragen aan sociale cohesie, actief burgerschap en gedeelde toekomstperspectieven. Door middel van educatie, ontmoeting en samenwerking creëren wij ruimte voor dialoog en persoonlijke ontwikkeling. Onze projecten zijn gericht op het zichtbaar maken en verbinden van mensen en gemeenschappen.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <Award className="w-12 h-12 text-[#05B6C4] mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Onze Waarden</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {aboutContent?.values?.map((value, index) => (
                <motion.div
                  key={value.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow w-full max-w-xs"
                >
                  <h3 className="text-xl font-bold text-[#05B6C4] mb-3">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{value.description}</p>
                </motion.div>
              )) || (
                <>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center w-full max-w-xs">
                    <h3 className="text-xl font-bold text-[#05B6C4] mb-3">Inclusiviteit</h3>
                    <p className="text-gray-700 leading-relaxed">Iedereen is welkom bij ons</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center w-full max-w-xs">
                    <h3 className="text-xl font-bold text-[#05B6C4] mb-3">Respect</h3>
                    <p className="text-gray-700 leading-relaxed">Gelijke waardering voor alle culturen</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center w-full max-w-xs">
                    <h3 className="text-xl font-bold text-[#05B6C4] mb-3">Samenwerking</h3>
                    <p className="text-gray-700 leading-relaxed">Samen zijn we sterker</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-center mb-12">
              <Users className="w-12 h-12 text-[#05B6C4] mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Ons Team</h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4] mx-auto"></div>
              </div>
            ) : team.length > 0 ? (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {team.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow w-full max-w-xs mx-auto"
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#05B6C4] to-[#3B87BE]">
                            <User className="w-24 h-24 text-white opacity-80" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {member.name}
                        </h3>
                        <p className="text-sm text-[#05B6C4] mb-2">{member.role}</p>
                        {member.category && (
                          <p className="text-xs text-gray-500">{member.category}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Team informatie wordt binnenkort toegevoegd</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Wil je meer weten?</h2>
          <p className="text-xl mb-8 opacity-90">
            Neem contact met ons op en ontdek hoe je kunt deelnemen aan onze projecten
          </p>
          <a
            href="mailto:info@stichtingatlas.nl"
            className="inline-block bg-white text-[#05B6C4] py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Neem Contact Op
          </a>
        </div>
      </section>
    </div>
  );
}
