'use client'

import { useState, useEffect } from 'react';
import { Heart, Target, Euro, Check, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DonerenPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/donations?active=true');
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    
    const finalAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);
    
    if (!finalAmount || finalAmount < 5) {
      alert('Minimum bağış tutarı €5');
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Stripe payment integration in Phase 3
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setSelectedCampaign(null);
      setAmount('');
      setCustomAmount('');
      setFormData({ name: '', email: '', message: '' });
      fetchCampaigns();
    } catch (error) {
      alert('Bağış işlemi sırasında bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bedankt voor uw donatie!</h2>
          <p className="text-gray-600 mb-6">
            Uw bijdrage zal een verschil maken. U ontvangt een bevestigingsmail.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              fetchCampaigns();
            }}
            className="w-full bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Terug naar Donatiecampagnes
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#B37B83] to-[#F7941D] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Steun Ons Werk
            </h1>
            <p className="text-xl text-white/90">
              Jouw donatie maakt het verschil voor onze gemeenschap
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {selectedCampaign ? (
          /* Donation Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <button
              onClick={() => setSelectedCampaign(null)}
              className="mb-6 text-[#05B6C4] hover:underline font-medium"
            >
              ← Terug naar campagnes
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <img
                  src={selectedCampaign.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'}
                  alt={selectedCampaign.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedCampaign.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{selectedCampaign.description}</p>

                {/* Progress */}
                <div className="mb-8 bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700">Verzameld</span>
                    <span className="text-sm font-semibold text-[#05B6C4]">
                      {Math.round(selectedCampaign.progress || 0)}% van doel
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                    <div
                      className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] h-4 rounded-full transition-all"
                      style={{ width: `${Math.min(selectedCampaign.progress || 0, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      €{selectedCampaign.totalDonated?.toFixed(2) || '0.00'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Doel: €{selectedCampaign.targetAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Amount Selection */}
                <form onSubmit={handleDonate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Selecteer bedrag *
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {predefinedAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setAmount(amt.toString());
                            setCustomAmount('');
                          }}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                            amount === amt.toString()
                              ? 'bg-[#05B6C4] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          €{amt}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setAmount('custom')}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                        amount === 'custom'
                          ? 'bg-[#05B6C4] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Ander bedrag
                    </button>
                    {amount === 'custom' && (
                      <input
                        type="number"
                        min="5"
                        step="0.01"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Voer bedrag in (min. €5)"
                        className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                        autoFocus
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Uw naam *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Volledige naam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="uw@email.nl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bericht (optioneel)
                    </label>
                    <textarea
                      rows="3"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none resize-none"
                      placeholder="Laat een bericht achter..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (!amount || (amount === 'custom' && !customAmount))}
                    className="w-full bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Bezig...' : `Doneer ${amount === 'custom' ? `€${customAmount || '...'}` : `€${amount || '...'}`}`}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    🔒 Beveiligde betaling via Stripe (wordt in Fase 3 geactiveerd)
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Main Content */
          <div className="max-w-6xl mx-auto">
            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-8 shadow-md mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Waarom doneren aan Stichting Atlas?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Met jouw steun kunnen wij blijven werken aan een inclusieve gemeenschap waar iedereen zich welkom voelt. 
                Jouw donatie helpt ons om evenementen te organiseren, educatieve programma's aan te bieden en mensen samen te brengen.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Gratis Evenementen', description: 'Toegankelijke activiteiten voor iedereen' },
                  { title: 'Educatie Programma\'s', description: 'Weekendonderwijs en culturele lessen' },
                  { title: 'Gemeenschapswerk', description: 'Verbinding en ondersteuning' },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <CheckCircle className="w-8 h-8 text-[#05B6C4] mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ANBI Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">ANBI Erkend</h3>
                  <p className="text-sm text-gray-600">
                    Stichting Atlas is erkend als ANBI (Algemeen Nut Beogende Instelling). 
                    Dit betekent dat jouw donatie fiscaal aftrekbaar kan zijn.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Campaigns List */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Actieve Donatiecampagnes
              </h2>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Laden...</div>
              ) : campaigns.length === 0 ? (
                <div className="bg-white rounded-lg p-12 shadow-md text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Momenteel zijn er geen actieve donatiecampagnes.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48">
                        <img
                          src={campaign.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400'}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(campaign.progress || 0, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-green-600">
                              €{campaign.totalDonated?.toFixed(2) || '0.00'}
                            </span>
                            <span className="text-gray-500">
                              van €{campaign.targetAmount?.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {campaign.donorCount || 0} donateurs
                          </span>
                          <span>{Math.round(campaign.progress || 0)}% bereikt</span>
                        </div>

                        <button
                          onClick={() => setSelectedCampaign(campaign)}
                          className="w-full bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Doneer Nu
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
