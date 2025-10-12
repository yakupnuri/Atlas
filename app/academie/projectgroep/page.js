'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Users, Sparkles } from 'lucide-react'

export default function ProjectgroepPage() {
  const projectTypes = [
    {
      title: 'Gemeenschapsprojecten',
      description: 'Lokale initiatieven die onze buurt mooier en leefbaarder maken',
      icon: Users
    },
    {
      title: 'Sociale Projecten',
      description: 'Hulp aan kwetsbare groepen en sociale cohesie versterken',
      icon: Heart
    },
    {
      title: 'Culturele Initiatieven',
      description: 'Evenementen en activiteiten die culturen samenbrengen',
      icon: Sparkles
    },
    {
      title: 'Duurzaamheid',
      description: 'Projecten gericht op een groenere en duurzamere toekomst',
      icon: Target
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Projectgroep</h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              Samen werken aan een betere gemeenschap
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Over de Projectgroep</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              De Projectgroep van Atlas Academie brengt vrijwilligers en gemeenschapsleden samen om 
              betekenisvolle projecten te realiseren. Van kleine buurtinitiatieven tot grotere sociale 
              programma's - wij maken het mogelijk.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Door actief deel te nemen aan onze projecten draag je bij aan een inclusievere samenleving, 
              ontwikkel je nieuwe vaardigheden en ontmoet je gelijkgestemde mensen. Elke bijdrage, groot 
              of klein, maakt het verschil.
            </p>
          </div>
        </div>
      </section>

      {/* Project Types Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Onze Projectgebieden</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projectTypes.map((project, index) => {
              const Icon = project.icon
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300"
                >
                  <Icon className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hoe doe je mee?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Neem Contact Op</h3>
                <p className="text-gray-600">Mail of bel ons voor meer informatie</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Kennismaken</h3>
                <p className="text-gray-600">Kom langs voor een vrijblijvend gesprek</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Start met een Project</h3>
                <p className="text-gray-600">Begin direct of start je eigen initiatief</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Word lid van onze projectgroep</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Meld je aan als vrijwilliger of stel je eigen projectidee voor
          </p>
          <a
            href="mailto:info@stichtingatlas.nl"
            className="inline-block bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Aanmelden als Vrijwilliger
          </a>
        </div>
      </section>
    </div>
  )
}
