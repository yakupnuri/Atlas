'use client'

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Heart, Euro, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DonerenPage() {
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeMode, setStripeMode] = useState('test');
  
  // Predefined donation amounts
  const donationOptions = [10, 25, 50, 100, 250, 500];
  
  // Fetch Stripe configuration on component mount
  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const response = await fetch('/api/stripe-config');
        
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Stripe ayarları yüklenemedi');
          return;
        }
        
        const { publishableKey, mode } = await response.json();
        setStripeMode(mode);
        setStripePromise(loadStripe(publishableKey));
        
        // Show test mode notice in console
        if (mode === 'test') {
          console.log('🧪 Test Mode aktif. Test kartı: 4242 4242 4242 4242');
        }
      } catch (err) {
        console.error('Error loading Stripe:', err);
        setError('Stripe yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      }
    };
    
    fetchStripeConfig();
  }, []);
  
  // Handle donation submission
  const handleDonation = async (e) => {
    e.preventDefault();
    
    // Validate amount
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount < 5) {
      setError('Minimum bağış tutarı €5');
      return;
    }
    
    // Validate email if provided
    if (donorEmail && !donorEmail.includes('@')) {
      setError('Geçerli bir e-posta adresi girin');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create checkout session
      const response = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount,
          donorName: donorName || 'Anoniem',
          donorEmail: donorEmail
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ödeme oturumu oluşturulamadı');
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message || 'Bağış işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle predefined amount selection
  const selectAmount = (value) => {
    setAmount(value.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Steun Stichting Atlas
            </h1>
            <p className="text-xl text-blue-100">
              Met uw donatie helpt u ons om een inclusieve gemeenschap op te bouwen waar iedereen kan groeien
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Impact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Uw Impact</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">€10</h3>
                    <p className="text-sm text-gray-600">
                      Verzorgt materialen voor één les
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">€50</h3>
                    <p className="text-sm text-gray-600">
                      Ondersteunt een maand activiteiten
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">€100+</h3>
                    <p className="text-sm text-gray-600">
                      Maakt een blijvend verschil
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ANBI Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">ANBI Status</h3>
                  <p className="text-sm text-green-700">
                    Stichting Atlas heeft de ANBI-status. Uw donatie is fiscaal aftrekbaar.
                  </p>
                </div>
              </div>
            </div>

            {/* Test Mode Notice */}
            {stripeMode === 'test' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Test Mode</h3>
                    <p className="text-sm text-yellow-700">
                      Test kaart: <code className="bg-yellow-100 px-2 py-1 rounded">4242 4242 4242 4242</code>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Doneer Nu</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {!stripePromise && !error && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Stripe wordt geladen...</p>
              </div>
            )}

            {stripePromise && (
              <form onSubmit={handleDonation} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kies een bedrag (EUR)
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {donationOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          amount === option.toString()
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => selectAmount(option)}
                      >
                        €{option}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Of ander bedrag..."
                      step="0.01"
                      min="5"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum bedrag: €5
                  </p>
                </div>

                {/* Donor Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Naam (optioneel)
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Uw naam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail (optioneel)
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="uw.email@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Voor bevestiging en belastingaftrek
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !stripePromise}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Verwerken...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Doneer €{amount || '0'}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  Beveiligde betaling via Stripe. Ondersteunt iDEAL en creditcards.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
