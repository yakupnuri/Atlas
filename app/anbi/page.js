'use client'

import { useState, useEffect } from 'react'
import { FileText, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ANBIPage() {
  const { t } = useLanguage()
  const [documents, setDocuments] = useState({
    beleidsplan: null,
    huisstijl: null,
    jaarrekening: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/anbi')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents || {})
      }
    } catch (error) {
      console.error('Error fetching ANBI documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const documentCards = [
    {
      id: 'beleidsplan',
      title: t('beleidsplan.title'),
      description: t('beleidsplan.description'),
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'huisstijl',
      title: t('huisstijl.title'),
      description: t('huisstijl.description'),
      icon: FileText,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'jaarrekening',
      title: t('jaarrekening.title'),
      description: t('jaarrekening.description'),
      icon: FileText,
      color: 'from-green-500 to-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* ANBI Info Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('info.title')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('info.description')}
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('info.fiscalTitle')}</h3>
                  <p className="text-gray-600 text-sm">{t('info.fiscalDesc')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('info.transparencyTitle')}</h3>
                  <p className="text-gray-600 text-sm">{t('info.transparencyDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('documents.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('documents.subtitle')}</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4] mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('loading')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {documentCards.map((card, index) => {
                const Icon = card.icon
                const document = documents[card.id]
                
                return (
                  <motion.div
                    key={card.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                      <Icon className="w-12 h-12 mb-4" />
                      <h3 className="text-2xl font-bold">{card.title}</h3>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-6 min-h-[60px]">{card.description}</p>
                      
                      {document && document.url ? (
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                        >
                          <Download className="w-5 h-5" />
                          {t('download')}
                        </a>
                      ) : (
                        <div className="text-center py-3 px-6 bg-gray-100 text-gray-500 rounded-lg">
                          {t('notAvailable')}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
          <p className="text-gray-600 mb-6">{t('contact.description')}</p>
          <a
            href="mailto:info@stichtingatlas.nl"
            className="inline-block bg-gradient-to-r from-[#05B6C4] to-[#0891A0] text-white py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            {t('contact.button')}
          </a>
        </div>
      </section>
    </div>
  )
}
