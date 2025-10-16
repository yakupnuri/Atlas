'use client';

import { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Neem Contact Op</h2>
          </div>
          <p className="text-sm text-blue-100">
            Vul het formulier in en we nemen zo snel mogelijk contact met u op
          </p>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Success Message */}
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Bericht verzonden!</h4>
                <p className="text-sm text-green-700">
                  Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Fout bij verzenden</h4>
                <p className="text-sm text-red-700">
                  Er is iets misgegaan. Probeer het later opnieuw.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Uw naam"
                />
              </div>
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="uw@email.nl"
                />
              </div>
            </div>

            {/* Phone & Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefoon (optioneel)
                </label>
                <input
                  type="tel"
                  id="modal-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="+31 6 12345678"
                />
              </div>
              <div>
                <label htmlFor="modal-subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Onderwerp
                </label>
                <input
                  type="text"
                  id="modal-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Waar gaat uw vraag over?"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700 mb-2">
                Bericht *
              </label>
              <textarea
                id="modal-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent transition-all resize-none disabled:opacity-50"
                placeholder="Typ hier uw bericht..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Verstuur Bericht
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Of neem direct contact op:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="mailto:info@stichtingatlas.com" className="flex items-center gap-2 text-[#05B6C4] hover:underline">
                <Mail className="w-4 h-4" />
                info@stichtingatlas.com
              </a>
              <a href="tel:+31123456789" className="flex items-center gap-2 text-[#05B6C4] hover:underline">
                <Phone className="w-4 h-4" />
                +31 (0)12 345 6789
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
