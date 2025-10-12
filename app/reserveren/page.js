'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Calendar, MapPin, Users } from 'lucide-react';

export default function ReserverenPage() {
  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams.get('eventId');
  
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    count: 1,
    notes: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventIdFromUrl && events.length > 0) {
      const event = events.find(e => e.id === eventIdFromUrl);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [eventIdFromUrl, events]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?upcoming=true');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEvent) {
      setError('Selecteer eerst een evenement');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', count: 1, notes: '' });
        setSelectedEvent(null);
      } else {
        setError(data.error || 'Er is iets misgegaan.');
      }
    } catch (error) {
      setError('Er is een fout opgetreden.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-8 shadow-lg max-w-md text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reservering Gelukt!</h2>
          <p className="text-gray-600 mb-4">
            Je ontvangt binnen enkele minuten een bevestigingsmail.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              fetchEvents();
            }}
            className="bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-2 rounded-lg font-semibold"
          >
            Nieuwe Reservering
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Reserveren
            </h1>
            <p className="text-gray-600">
              Selecteer een evenement en reserveer je plaats
            </p>
          </motion.div>

          {!selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Kies een evenement</h2>
              
              {events.length === 0 ? (
                <div className="bg-white rounded-lg p-8 shadow-md text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Geen aankomende evenementen</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-left"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-2">{event.title}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.startAt).toLocaleDateString('nl-NL')}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.locationName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {selectedEvent && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-md mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Geselecteerd</h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-sm text-[#05B6C4] hover:underline"
                  >
                    Wijzigen
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedEvent.title}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(selectedEvent.startAt).toLocaleDateString('nl-NL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Naam *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Je volledige naam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="je@email.nl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aantal personen *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={selectedEvent.capacity}
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Opmerkingen
                    </label>
                    <textarea
                      rows="4"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none resize-none"
                      placeholder="Vragen of bijzonderheden..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
                    {submitting ? 'Bezig...' : 'Bevestig Reservering'}
                  </button>
                </div>
              </motion.form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
