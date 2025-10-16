'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function CRMLoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if email is @stichtingatlas.com
      const isAtlasEmail = email.endsWith('@stichtingatlas.com');

      if (isAtlasEmail) {
        // Use Google OAuth for @stichtingatlas.com emails
        const result = await signIn('google', {
          callbackUrl: '/crm/dashboard',
          redirect: true,
        });
      } else {
        // Use credentials login for volunteers
        const result = await signIn('crm-credentials', {
          email: email,
          password: password,
          redirect: false,
        });

        if (result?.error) {
          setError('E-posta veya şifre hatalı');
          setIsLoading(false);
          return;
        }

        if (result?.ok) {
          window.location.href = '/crm/dashboard';
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş sırasında bir hata oluştu');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <Lock className="w-8 h-8" />
            <h2 className="text-2xl font-bold">CRM Sistemi Girişi</h2>
          </div>
          <p className="text-sm text-purple-100">
            Yetkili kullanıcılar ve gönüllüler için özel erişim
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="ornek@stichtingatlas.com"
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500">
              @stichtingatlas.com uzantılı e-postalar için Google ile giriş yapılacaktır
            </p>
          </div>

          {/* Password Input - Only shown for non-Atlas emails */}
          {email && !email.endsWith('@stichtingatlas.com') && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Giriş yapılıyor...</span>
              </>
            ) : (
              <span>
                {email.endsWith('@stichtingatlas.com') ? 'Google ile Giriş Yap' : 'Giriş Yap'}
              </span>
            )}
          </button>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-xs text-blue-700">
              <strong>Kısıtlı Erişim:</strong> Bu sistem sadece yetkili kullanıcılar için şifre korumalıdır.
              Giriş bilgilerinizi almak için yöneticinizle iletişime geçin.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
