'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowRight, AlertCircle, Facebook, Twitter, Linkedin, Share2, Instagram } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import CountdownTimer from '@/components/CountdownTimer';
import CapacityVisualization from '@/components/CapacityVisualization';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [capacity, setCapacity] = useState({ reserved: 0, available: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.slug}`);
      const data = await response.json();
      
      if (data.event) {
        setEvent(data.event);
        setCapacity({
          reserved: data.reservedCount || 0,
          available: data.available || data.event.capacity,
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Evenement niet gevonden</h2>
          <Link href="/events" className="text-[#05B6C4] hover:underline">
            Terug naar evenementen
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startAt);
  const endDate = new Date(event.endAt);
  const duration = Math.round((endDate - startDate) / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Begint over...
              </h2>
              <CountdownTimer targetDate={event.startAt} />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Over dit evenement</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Evenementdetails</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#05B6C4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#05B6C4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Datum & Tijd</p>
                    <p className="text-gray-600">
                      {format(startDate, 'EEEE d MMMM yyyy', { locale: nl })}
                    </p>
                    <p className="text-gray-600">
                      {format(startDate, 'HH:mm', { locale: nl })} - {format(endDate, 'HH:mm', { locale: nl })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#05B6C4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#05B6C4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Duur</p>
                    <p className="text-gray-600">{duration} uur</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#05B6C4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#05B6C4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Locatie</p>
                    <p className="text-gray-600">{event.locationName}</p>
                    <p className="text-gray-600 text-sm">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#05B6C4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#05B6C4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Kosten</p>
                    <p className="text-gray-600">{event.isPaid ? `€${event.price}` : 'Gratis'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Locatie op de kaart</h2>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-4">{event.address}</p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Capacity Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CapacityVisualization
                capacity={event.capacity}
                reserved={capacity.reserved}
              />
            </motion.div>

            {/* Reserve Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {capacity.available > 0 ? (
                <Link
                  href={`/reserveren?eventId=${event.id}`}
                  className="block w-full bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white text-center py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  <span className="flex items-center justify-center gap-2">
                    Reserveer Nu
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              ) : (
                <div className="bg-gray-100 text-gray-600 text-center py-4 rounded-lg font-semibold">
                  Uitverkocht
                </div>
              )}
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-2">Let op</h3>
              <p className="text-sm text-gray-600">
                Reserveer je plek tijdig! Het aantal plaatsen is beperkt en vol = vol.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
