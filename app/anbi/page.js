'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Download, Award, CheckCircle } from 'lucide-react';

export default function ANBIPage() {
  const [anbiData, setAnbiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchANBIData();
  }, []);

  const fetchANBIData = async () => {
    try {
      const response = await fetch('/api/anbi');
      const data = await response.json();
      setAnbiData(data.anbi);
    } catch (error) {
      console.error('Error fetching ANBI data:', error);
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

  const documents = [
    {
      id: 'beleidsplan',
      title: 'Beleidsplan',
      icon: FileText,
      description: anbiData?.beleidsplan?.description || 'Ons beleidsplan beschrijft onze doelstellingen en strategieën voor de komende jaren.',
      pdfUrl: anbiData?.beleidsplan?.pdfUrl,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'huisstijl',
      title: 'Huisstijl',
      icon: Award,
      description: anbiData?.huisstijl?.description || 'Onze huisstijlgids met logo\'s, kleuren en richtlijnen voor communicatie.',
      pdfUrl: anbiData?.huisstijl?.pdfUrl,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'jaarrekening',
      title: 'Jaarrekening',
      icon: Shield,
      description: anbiData?.jaarrekening?.description || 'Financiële rapportage en transparantie over onze inkomsten en uitgaven.',
      pdfUrl: anbiData?.jaarrekening?.pdfUrl,
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ANBI Status
            </h1>
            <p className="text-xl text-white/90">
              Stichting Atlas is erkend als Algemeen Nut Beogende Instelling
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is ANBI */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Wat is ANBI?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                {anbiData?.description || 'Een ANBI (Algemeen Nut Beogende Instelling) is een organisatie die zich inzet voor het algemeen nut. Door onze ANBI-status kunnen donateurs hun giften aan Stichting Atlas onder voorwaarden aftrekken van de belasting.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#05B6C4] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Fiscaal voordeel</h3>
                    <p className="text-sm text-gray-600">Donaties zijn fiscaal aftrekbaar</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#05B6C4] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Transparantie</h3>
                    <p className="text-sm text-gray-600">Openbare financiële verslaglegging</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#05B6C4] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Algemeen nut</h3>
                    <p className="text-sm text-gray-600">Werken voor de gemeenschap</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#05B6C4] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Controle</h3>
                    <p className="text-sm text-gray-600">Toezicht door Belastingdienst</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Documents Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Publicatieplicht Documenten
            </h2>
            <p className="text-gray-600 text-lg">
              Als ANBI zijn wij verplicht deze documenten openbaar te maken
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-br ${doc.color} p-6 text-white`}>
                  <doc.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold">{doc.title}</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-6 min-h-[80px]">
                    {doc.description}
                  </p>
                  
                  {doc.pdfUrl ? (
                    <a
                      href={doc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                  ) : (
                    <div className="text-center py-3 px-6 bg-gray-100 text-gray-500 rounded-lg">
                      Binnenkort beschikbaar
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-8 text-center"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">ANBI Gegevens</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Naam:</strong> {anbiData?.organizationName || 'Stichting Atlas'}</p>
              <p><strong>RSIN/Fiscaal nummer:</strong> {anbiData?.rsin || 'XXXXXXXXX'}</p>
              <p><strong>Adres:</strong> {anbiData?.address || 'Amsterdam, Nederland'}</p>
              <p><strong>E-mail:</strong> {anbiData?.email || 'info@stichtingatlas.nl'}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
