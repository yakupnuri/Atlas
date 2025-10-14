'use client'

import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, Briefcase, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AcademiePage() {
  const programs = [
    {
      title: 'Cultuur & Educatiecentrum',
      description: 'Ontdek onze educatieve programma\'s voor alle leeftijden. Cursussen in kunst, cultuur en taal.',
      icon: BookOpen,
      href: '/academie/cultuur-educatie',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Carrièrecentrum',
      description: 'Professionele ontwikkeling en carrière coaching. Workshops, trainingen en mentorschap.',
      icon: Briefcase,
      href: '/academie/carriere',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Projectgroep',
      description: 'Doe mee aan gemeenschapsprojecten en vrijwilligerswerk. Maak impact in de samenleving.',
      icon: Users,
      href: '/academie/projectgroep',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#05B6C4] via-[#3B87BE] to-[#0891A0] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GraduationCap className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Atlas Academie</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white/90">
              Jouw brug naar persoonlijke groei en professionele ontwikkeling
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Onze Programma's
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kies uit onze diverse programma's en start jouw reis naar groei en ontwikkeling
            </p>
          </motion.div>

          {/* Cards - Centered with Flex Wrap */}
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => (
              <motion.div
                key={program.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                className="w-full sm:w-80"
              >
                <Link href={program.href}>
                  <div className={`bg-gradient-to-br ${program.bgGradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full flex flex-col`}>
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${program.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                      <program.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
                      {program.description}
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center text-[#05B6C4] font-semibold group">
                      <span>Meer informatie</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Neem contact met ons op voor meer informatie over onze programma's en hoe je kunt deelnemen.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-[#05B6C4] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Contact Opnemen
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
