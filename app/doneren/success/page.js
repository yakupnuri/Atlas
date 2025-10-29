'use client'

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SuccessPageContent() {
  const [status, setStatus] = useState('loading');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      router.push('/doneren');
      return;
    }
    
    checkPaymentStatus(sessionId);
  }, [searchParams, router]);
  
  const checkPaymentStatus = async (sessionId) => {
    try {
      const response = await fetch(`/api/stripe-status?session_id=${sessionId}`);
      
      if (!response.ok) throw new Error('Ödeme durumu kontrol edilemedi');
      
      const data = await response.json();
      setPaymentInfo(data);
      
      if (data.payment_status === 'paid') {
        setStatus('success');
      } else if (data.status === 'open') {
        setStatus('processing');
        setTimeout(() => checkPaymentStatus(sessionId), 2000);
      } else {
        setStatus('failed');
      }
    } catch (err) {
      console.error('Error checking payment:', err);
      setStatus('error');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Uw betaling wordt geverifieerd...
            </h1>
            <p className="text-gray-600">
              Even geduld alstublieft
            </p>
          </>
        )}
        
        {status === 'processing' && (
          <>
            <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Uw donatie wordt verwerkt...
            </h1>
            <p className="text-gray-600">
              Dit kan even duren
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Hartelijk Dank!
            </h1>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-blue-900 mb-2">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-bold text-xl">
                  €{paymentInfo?.amount || '0'}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Uw donatie is ontvangen
              </p>
            </div>
            
            <p className="text-gray-600 mb-8">
              Uw steun maakt een groot verschil voor onze gemeenschap. 
              U ontvangt een bevestiging per e-mail.
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Terug naar Home
              </Link>
              <Link
                href="/nieuws"
                className="block w-full border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Bekijk Nieuws
              </Link>
            </div>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Betaling Niet Voltooid
            </h1>
            
            <p className="text-gray-600 mb-8">
              Uw donatie is niet voltooid. Probeer het alstublieft opnieuw.
            </p>
            
            <Link 
              href="/doneren"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Probeer Opnieuw
            </Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-yellow-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verificatiefout
            </h1>
            
            <p className="text-gray-600 mb-8">
              We kunnen de betalingsstatus niet verifiëren. 
              Neem contact op met ons als u denkt dat dit een fout is.
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/contact"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Contact Opnemen
              </Link>
              <Link 
                href="/doneren"
                className="block w-full border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Probeer Opnieuw
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
