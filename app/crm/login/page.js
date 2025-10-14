'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function CRMLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CRM şifresi - .env'den alınabilir
  const CRM_PASSWORD = process.env.NEXT_PUBLIC_CRM_PASSWORD || 'atlas2024';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password === CRM_PASSWORD) {
      // CRM session başlat
      localStorage.setItem('crmAuth', 'true');
      localStorage.setItem('crmLoginTime', Date.now().toString());
      
      // CRM dashboard'a yönlendir
      router.push('/crm/projeler');
    } else {
      setError('Yanlış şifre');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-purple-100 rounded-full p-6">
              <Lock className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              CRM Girişi
            </h1>
            <p className="text-gray-600">
              Proje Yönetim Sistemi
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="CRM şifresini girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              CRM sistemine erişim için özel şifre gereklidir.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Email adresi gerektirmez, sadece şifre ile giriş
            </p>
          </div>

          {/* Back to public */}
          <div className="mt-4 text-center">
            <a
              href="/academie/projectgroep"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              ← Public proje sayfasına dön
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
