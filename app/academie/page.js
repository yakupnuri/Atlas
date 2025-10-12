'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, Briefcase, Target } from 'lucide-react'
import Link from 'next/link'

export default function AcademiePage() {
  const programs = [
    {
      title: 'Cultuur & Educatiecentrum',
      description: 'Ontdek onze educatieve programma\'s voor alle leeftijden. Cursussen in kunst, cultuur en taal.',
      icon: GraduationCap,
      href: '/academie/cultuur-educatie',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Carrièrecentrum',
      description: 'Professionele ontwikkeling en carrière coaching. Workshops, trainingen en mentorschap.',
      icon: Briefcase,
      href: '/academie/carriere',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Projectgroep',
      description: 'Doe mee aan gemeenschapsprojecten en vrijwilligerswerk. Maak impact in de samenleving.',
      icon: Target,
      href: '/academie/projectgroep',
      color: 'from-green-500 to-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GraduationCap className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Atlas Academie</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Jouw brug naar persoonlijke groei en professionele ontwikkeling
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Onze Missie</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Atlas Academie biedt hoogwaardige educatie, training en ontwikkelingsprogramma's 
              die individuen en gemeenschappen in staat stellen hun volledige potentieel te bereiken. 
              Wij geloven in de kracht van educatie als motor voor sociale verandering en persoonlijke groei.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Onze Programma's</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kies het programma dat bij jouw doelen en interesses past
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <motion.div
                  key={program.href}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={program.href}>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full cursor-pointer group">
                      <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                        <Icon className="w-12 h-12 mb-4" />
                        <h3 className="text-2xl font-bold">{program.title}</h3>
                      </div>
                      
                      <div className="p-6">
                        <p className="text-gray-600 mb-6">{program.description}</p>
                        <span className="text-[#05B6C4] font-semibold group-hover:underline">
                          Meer informatie →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Klaar om te starten?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Neem contact met ons op voor meer informatie over onze programma's en inschrijving
          </p>
          <a
            href="mailto:info@stichtingatlas.nl"
            className="inline-block bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Contact Opnemen
          </a>
        </div>
      </section>
    </div>
  )
}
