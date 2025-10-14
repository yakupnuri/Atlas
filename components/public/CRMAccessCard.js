'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CRMAccessCard() {
  const router = useRouter();

  return (
    <Card className="mb-12 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="p-8">
        <div className="flex items-start gap-6">
          <div className="bg-white/20 rounded-full p-4">
            <Lock className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">CRM & Project Management</h3>
            <p className="text-blue-100 mb-4">
              U heeft toegang tot het volledige CRM-systeem om alle projecten, fondsen, vergaderingen en teamleden te beheren.
            </p>
            <Button
              onClick={() => router.push('/admin/crm/projeler')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Ga naar CRM Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
