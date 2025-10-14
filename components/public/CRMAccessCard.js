'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CRMAccessCard() {
  const router = useRouter();

  return (
    <Card className="mb-12 overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="p-8">
        <div className="flex items-start gap-6">
          <div className="bg-white/20 rounded-full p-4">
            <Lock className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">CRM & Proje Yönetim Sistemi</h3>
            <p className="text-purple-100 mb-4">
              Özel şifre ile CRM sistemine erişin. Tüm projeleri, fonları, toplantıları ve ekip üyelerini yönetin.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm">
                <strong>⚠️ Kısıtlı Erişim:</strong> Bu sistem sadece yetkili kullanıcılar için şifre korumalıdır.
              </p>
            </div>
            <Button
              onClick={() => router.push('/crm/login')}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Lock className="w-4 h-4 mr-2" />
              CRM Girişi
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
