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
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    count: 1,
  });
  
  const [participantNames, setParticipantNames] = useState(['']);

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

  // Update participant names array when count changes
  useEffect(() => {
    const count = parseInt(formData.count) || 1;
    const currentNames = [...participantNames];
    
    if (count > currentNames.length) {
      // Add empty strings for new participants
      const newNames = [...currentNames, ...Array(count - currentNames.length).fill('')];
      setParticipantNames(newNames);
    } else if (count < currentNames.length) {
      // Remove extra participants
      setParticipantNames(currentNames.slice(0, count));
    }
  }, [formData.count]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?upcoming=true');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error:', error);
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

    // Validate all participant names are filled
    const emptyNames = participantNames.some(name => !name.trim());
    if (emptyNames) {
      setError('Vul alle deelnemersnamen in');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const participants = participantNames.map(name => ({ name: name.trim() }));
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          email: formData.email,
          phone: formData.phone,
          participants,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSuccessData(data);
        setFormData({ email: '', phone: '', count: 1 });
        setParticipantNames(['']);
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
          className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reservering Gelukt!</h2>
          <p className="text-gray-600 mb-6 text-center">
            Je ontvangt binnen enkele minuten een bevestigingsmail.
          </p>
          
          {successData?.reservation?.participants && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Jouw Badge Nummers:</h3>
              <div className="space-y-2">
                {successData.reservation.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded">
                    <span className="text-gray-700">{participant.name}</span>
                    <span className="bg-[#05B6C4] text-white px-3 py-1 rounded-full font-bold text-sm">
                      #{participant.badgeNumber}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                💡 Bewaar deze badge nummers voor het printen van badges
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              setSuccess(false);
              setSuccessData(null);
              fetchEvents();
            }}
            className="w-full bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-3 rounded-lg font-semibold"
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
        <div className="max-w-6xl mx-auto">
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
                          src={event.bannerImage || event.image}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-2">{event.title}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {(() => {
                                try {
                                  const dateStr = event.startAt || event.date;
                                  if (!dateStr) return 'Datum TBA';
                                  const eventDate = new Date(dateStr);
                                  if (isNaN(eventDate.getTime())) return 'Datum TBA';
                                  return eventDate.toLocaleDateString('nl-NL');
                                } catch (e) {
                                  return 'Datum TBA';
                                }
                              })()}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.locationName || event.location || 'Locatie TBA'}
                            </div>
                            {event.available !== undefined && (
                              <div className="flex items-center gap-2 text-green-600 font-medium">
                                <Users className="w-4 h-4" />
                                {event.available} plaatsen beschikbaar
                              </div>
                            )}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form Area */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-6 shadow-md mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Geselecteerd Evenement</h2>
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        setParticipantNames(['']);
                        setFormData({ email: '', phone: '', count: 1 });
                      }}
                      className="text-sm text-[#05B6C4] hover:underline"
                    >
                      Wijzigen
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedEvent.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {(() => {
                      try {
                        const dateStr = selectedEvent.startAt || selectedEvent.date;
                        if (!dateStr) return 'Datum nog niet bekend';
                        const eventDate = new Date(dateStr);
                        if (isNaN(eventDate.getTime())) return 'Datum nog niet bekend';
                        return eventDate.toLocaleDateString('nl-NL', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                      } catch (e) {
                        return 'Datum nog niet bekend';
                      }
                    })()}
                  </p>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
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
                        Telefoonnummer (optioneel)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                        placeholder="+31 6 12345678"
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
                        onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Vul hieronder de naam in van elke deelnemer
                      </p>
                    </div>

                    {/* Dynamic Participant Name Fields */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Namen van deelnemers *
                      </label>
                      {participantNames.map((name, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#05B6C4] text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => {
                              const newNames = [...participantNames];
                              newNames[index] = e.target.value;
                              setParticipantNames(newNames);
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                            placeholder={`Naam deelnemer ${index + 1}`}
                          />
                        </div>
                      ))}
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
              </div>

              {/* Sidebar - Other Events */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-md lg:sticky lg:top-24"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Andere Evenementen</h3>
                  <div className="space-y-4">
                    {events
                      .filter(e => e.id !== selectedEvent.id)
                      .slice(0, 4)
                      .map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setSelectedEvent(event);
                            setFormData({ email: '', phone: '', count: 1 });
                            setParticipantNames(['']);
                            setError('');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-[#05B6C4] hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={event.bannerImage || event.image}
                              alt={event.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Calendar className="w-3 h-3" />
                                {(() => {
                                  try {
                                    const dateStr = event.startAt || event.date;
                                    if (!dateStr) return 'Datum TBA';
                                    const eventDate = new Date(dateStr);
                                    if (isNaN(eventDate.getTime())) return 'Datum TBA';
                                    return eventDate.toLocaleDateString('nl-NL', {
                                      day: 'numeric',
                                      month: 'short'
                                    });
                                  } catch (e) {
                                    return 'Datum TBA';
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                  
                  {events.length > 5 && (
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="w-full mt-4 text-center text-sm text-[#05B6C4] hover:underline font-medium"
                    >
                      Alle evenementen bekijken
                    </button>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
