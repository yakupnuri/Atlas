'use client'

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h1>
          <p className="text-white/80 text-sm">Access Denied</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-start">
              <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  Yetkisiz Giriş Denemesi
                </h3>
                <p className="text-sm text-red-700">
                  Google hesabınız admin paneline erişim yetkisine sahip değil.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Erişim için:</p>
                <p>
                  Sistem yöneticisi ile iletişime geçerek Google hesabınızın 
                  admin listesine eklenmesini talep edin.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Not:</strong> Sadece önceden onaylanmış email adresleri 
                Google ile giriş yapabilir.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5" />
              Giriş Sayfasına Dön
            </Link>
            
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Ana Sayfaya Git
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Hata Kodu: {error || 'AccessDenied'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
