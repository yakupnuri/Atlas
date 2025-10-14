'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Mail, 
  Phone,
  Calendar,
  User,
  Building,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Euro,
  Briefcase
} from 'lucide-react';

export default function ApplicationDetailModal({ application, onClose, onUpdate }) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const endpoint = application.type === 'volunteer' ? '/api/crm/volunteers' :
                      application.type === 'donation' ? '/api/crm/donations' :
                      '/api/crm/sponsors';

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          status: newStatus,
          notes: notes || undefined
        })
      });

      if (res.ok) {
        setStatus(newStatus);
        alert('Durum başarıyla güncellendi');
        onUpdate();
      } else {
        alert('Güncelleme başarısız oldu');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'volunteer': return 'bg-blue-100 text-blue-800';
      case 'donation': return 'bg-green-100 text-green-800';
      case 'sponsor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'volunteer': return 'Gönüllü Başvurusu';
      case 'donation': return 'Bağış';
      case 'sponsor': return 'Sponsor Başvurusu';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <Badge className={`${getTypeColor(application.type)} mb-3`}>
                {getTypeText(application.type)}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900">
                {application.fullName || application.contactPerson || application.companyName}
              </h2>
              <p className="text-gray-600 mt-1">{application.projectTitle}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">İletişim Bilgileri</h3>
              
              {application.companyName && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Şirket</p>
                    <p className="font-medium text-gray-900">{application.companyName}</p>
                  </div>
                </div>
              )}

              {application.contactPerson && application.companyName && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">İletişim Kişisi</p>
                    <p className="font-medium text-gray-900">{application.contactPerson}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">E-posta</p>
                  <a 
                    href={`mailto:${application.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {application.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <a 
                    href={`tel:${application.phone}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {application.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Başvuru Tarihi</p>
                  <p className="font-medium text-gray-900">{formatDate(application.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Başvuru Detayları</h3>

              {application.availability && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Müsaitlik</p>
                    <p className="font-medium text-gray-900 capitalize">{application.availability}</p>
                  </div>
                </div>
              )}

              {application.sponsorshipType && (
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Sponsorluk Tipi</p>
                    <p className="font-medium text-gray-900">
                      {application.sponsorshipType === 'financial' ? 'Finansal' :
                       application.sponsorshipType === 'inkind' ? 'Ayni' : 'İkisi de'}
                    </p>
                  </div>
                </div>
              )}

              {application.amount && (
                <div className="flex items-start gap-3">
                  <Euro className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {application.type === 'donation' ? 'Bağış Tutarı' : 'Önerilen Tutar'}
                    </p>
                    <p className="font-bold text-green-600 text-xl">
                      €{application.amount.toLocaleString('nl-NL')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          {application.experience && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Deneyim</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">{application.experience}</p>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Mesaj
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line">{application.message}</p>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Durum Güncelle</h3>
            
            <div className="flex gap-3 mb-4">
              <Button
                onClick={() => handleUpdateStatus('reviewing')}
                disabled={loading || status === 'reviewing'}
                variant={status === 'reviewing' ? 'default' : 'outline'}
                className="flex-1"
              >
                <Clock className="w-4 h-4 mr-2" />
                İnceleniyor
              </Button>

              <Button
                onClick={() => handleUpdateStatus('accepted')}
                disabled={loading || status === 'accepted'}
                variant={status === 'accepted' ? 'default' : 'outline'}
                className={`flex-1 ${status === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Kabul Et
              </Button>

              <Button
                onClick={() => handleUpdateStatus('rejected')}
                disabled={loading || status === 'rejected'}
                variant={status === 'rejected' ? 'default' : 'outline'}
                className={`flex-1 ${status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reddet
              </Button>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Not Ekle (opsiyonel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Başvuru hakkında notlarınız..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Kapat
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
