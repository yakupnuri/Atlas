'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, Mail } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple demo login - in production, this would use proper authentication
    // For now, we'll use localStorage to simulate a session
    if (email) {
      try {
        // Store email in localStorage
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('adminToken', 'demo-token-' + Date.now());
        
        // Redirect to dashboard
        router.push('/admin/dashboard');
      } catch (err) {
        setError('Login başarısız oldu');
        setLoading(false);
      }
    } else {
      setError('Lütfen email adresinizi girin');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image 
              src="/web-logo.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="rounded"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Girişi
            </h1>
            <p className="text-gray-600">
              Stichting Atlas Admin Panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ornek@stichtingatlas.com"
                  required
                />
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            >
              {loading ? (
                'Giriş yapılıyor...'
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              <strong>Demo Modül:</strong> Herhangi bir email ile giriş yapabilirsiniz.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              CRM erişimi için: <strong>@stichtingatlas.com</strong> email gereklidir.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
