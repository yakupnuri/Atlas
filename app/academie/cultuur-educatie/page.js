'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Globe, Calendar } from 'lucide-react'

export default function CultuurEducatiePage() {
  const programs = [
    {
      title: 'Taalcursussen',
      description: 'Nederlands, Turks, Engels en andere talen voor alle niveaus',
      icon: Globe
    },
    {
      title: 'Kunst & Cultuur',
      description: 'Workshops in schilderen, muziek, dans en theater',
      icon: BookOpen
    },
    {
      title: 'Kinderactiviteiten',
      description: 'Educatieve programma\'s en activiteiten voor kinderen',
      icon: Users
    },
    {
      title: 'Seizoensactiviteiten',
      description: 'Speciale cursussen en evenementen per seizoen',
      icon: Calendar
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cultuur & Educatiecentrum</h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              Leer, groei en ontdek in een inclusieve en ondersteunende omgeving
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Over het Centrum</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Het Cultuur & Educatiecentrum van Atlas Academie biedt een breed scala aan cursussen 
              en activiteiten voor alle leeftijden. Van taalcursussen tot kunstworkshops, wij helpen 
              iedereen om te leren en te groeien.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ons centrum is een ontmoetingsplaats waar culturen samenkomen en waar leren een plezierige 
              en sociale ervaring is. Onze ervaren docenten zorgen voor kwalitatief hoogstaand onderwijs 
              in een vriendelijke sfeer.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Onze Programma's</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300"
                >
                  <Icon className="w-12 h-12 text-blue-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600">{program.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Interesse in onze cursussen?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Neem contact met ons op voor het huidige cursusaanbod, roosters en inschrijving
          </p>
          <a
            href="mailto:info@stichtingatlas.nl"
            className="inline-block bg-white text-blue-600 py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Informatie Aanvragen
          </a>
        </div>
      </section>
    </div>
  )
}
