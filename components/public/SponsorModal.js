'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Handshake, CheckCircle, Building } from 'lucide-react';

export default function SponsorModal({ project, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    sponsorshipType: 'financial',
    amount: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/crm/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectId: project.id,
          projectTitle: project.title,
          type: 'sponsor'
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        alert('Er is een fout opgetreden. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md p-8 text-center animate-fade-in">
          <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Bedankt voor uw interesse!</h3>
          <p className="text-gray-600">
            We nemen spoedig contact met u op om de sponsormogelijkheden te bespreken.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8 animate-slide-up">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Word Sponsor
              </h2>
              <p className="text-gray-600">
                Voor: <span className="font-semibold">{project.title}</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrijfsnaam *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Naam van uw bedrijf"
                />
              </div>
            </div>

            {/* Contact Person & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contactpersoon *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Uw naam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="contact@bedrijf.nl"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefoonnummer *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+31 20 1234567"
              />
            </div>

            {/* Sponsorship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type sponsoring *
              </label>
              <select
                required
                value={formData.sponsorshipType}
                onChange={(e) => setFormData({ ...formData, sponsorshipType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="financial">Financiële bijdrage</option>
                <option value="inkind">Diensten/producten</option>
                <option value="both">Beide</option>
              </select>
            </div>

            {/* Amount (if financial) */}
            {(formData.sponsorshipType === 'financial' || formData.sponsorshipType === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indicatief bedrag (optioneel)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="€ 0"
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bericht / Voorstellen *
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Vertel ons over uw sponsorplannen en wat u zou willen bijdragen..."
              />
            </div>

            {/* Benefits Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Sponsor Voordelen:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Logo op projectmaterialen</li>
                <li>• Vermelding op website en social media</li>
                <li>• Mogelijkheid tot netwerkevenementen</li>
                <li>• Maatwerk sponsorpakketten beschikbaar</li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
              >
                {loading ? (
                  'Verzenden...'
                ) : (
                  <>
                    <Handshake className="w-4 h-4 mr-2" />
                    Aanvraag Indienen
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                variant="outline"
              >
                Annuleren
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}