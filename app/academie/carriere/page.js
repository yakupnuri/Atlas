'use client'

import { motion } from 'framer-motion'
import { Briefcase, Target, Users, TrendingUp } from 'lucide-react'

export default function CarrierePage() {
  const services = [
    {
      title: 'Carrière Coaching',
      description: 'Persoonlijke begeleiding bij carrièrekeuzes en ontwikkeling',
      icon: Target
    },
    {
      title: 'CV & Sollicitatie Training',
      description: 'Leer hoe je een sterk CV maakt en succesvol solliciteert',
      icon: Briefcase
    },
    {
      title: 'Netwerk Evenementen',
      description: 'Ontmoet professionals en bouw je netwerk uit',
      icon: Users
    },
    {
      title: 'Zakelijke Vaardigheden',
      description: 'Workshops in leiderschap, communicatie en management',
      icon: TrendingUp
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Carrièrecentrum</h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              Bouw aan jouw professionele toekomst met onze ondersteuning
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Over het Carrièrecentrum</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Het Carrièrecentrum van Atlas Academie ondersteunt professionals bij elke stap van hun 
              carrière. Of je nu op zoek bent naar je eerste baan, een carrièreswitch wilt maken, of 
              door wilt groeien in je huidige functie - wij staan voor je klaar.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Onze ervaren coaches en mentoren helpen je met praktische tools, persoonlijke begeleiding 
              en waardevolle netwerkmogelijkheden. Wij geloven dat iedereen het potentieel heeft om 
              succesvol te zijn in hun gekozen carrièrepad.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Onze Diensten</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300"
                >
                  <Icon className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start jouw carrièretraject</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Maak een afspraak voor een vrijblijvend oriëntatiegesprek met een van onze coaches
          </p>
          <a
            href="mailto:info@stichtingatlas.nl"
            className="inline-block bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Afspraak Maken
          </a>
        </div>
      </section>
    </div>
  )
}
