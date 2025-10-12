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

  const shareOnSocial = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = event?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else if (platform === 'instagram') {
      // Copy to clipboard for Instagram
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          alert('Link gekopieerd! Plak deze in je Instagram story of post.');
        });
      }
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

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Locatie op de kaart</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={
                    event.lat && event.lng
                      ? `https://www.google.com/maps?q=${event.lat},${event.lng}&hl=nl&z=15&output=embed`
                      : `https://www.google.com/maps?q=${encodeURIComponent(event.address || event.locationName)}&hl=nl&z=15&output=embed`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Kaart van ${event.locationName}`}
                />
              </div>
              <div className="mt-4 flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#05B6C4] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">{event.locationName}</p>
                  <p className="text-sm text-gray-600">{event.address}</p>
                  <a
                    href={
                      event.lat && event.lng
                        ? `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`
                        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address || event.locationName)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#05B6C4] hover:underline mt-1 inline-block"
                  >
                    Routebeschrijving →
                  </a>
                </div>
              </div>
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

            {/* Volunteers Section */}
            {event.volunteers && event.volunteers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3 className="font-semibold text-gray-800 mb-4">Organisatieteam</h3>
                <p className="text-sm text-gray-600 mb-4">Dit evenement wordt georganiseerd door onze toegewijde vrijwilligers</p>
                <div className="space-y-3">
                  {event.volunteers.map((volunteer, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#05B6C4] to-[#3B87BE] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {volunteer.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{volunteer}</p>
                        <p className="text-xs text-gray-500">Vrijwilliger</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Social Media Share */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4">Deel dit evenement</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="flex items-center justify-center w-10 h-10 bg-[#1877F2] text-white rounded-full hover:shadow-lg transition-all"
                  title="Deel op Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="flex items-center justify-center w-10 h-10 bg-[#1DA1F2] text-white rounded-full hover:shadow-lg transition-all"
                  title="Deel op Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareOnSocial('linkedin')}
                  className="flex items-center justify-center w-10 h-10 bg-[#0A66C2] text-white rounded-full hover:shadow-lg transition-all"
                  title="Deel op LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareOnSocial('whatsapp')}
                  className="flex items-center justify-center w-10 h-10 bg-[#25D366] text-white rounded-full hover:shadow-lg transition-all"
                  title="Deel via WhatsApp"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareOnSocial('instagram')}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white rounded-full hover:shadow-lg transition-all"
                  title="Deel op Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Previous Year Gallery Section */}
        {event.hasPreviousEdition && event.photoGallery && event.photoGallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Foto's van {event.previousYear || 'vorig jaar'}
              </h2>
              <p className="text-gray-600 mb-6">
                Bekijk sfeerimpressies van onze eerdere editie
              </p>
              
              {event.relatedNewsSlug && (
                <Link
                  href={`/nieuws/${event.relatedNewsSlug}`}
                  className="inline-flex items-center gap-2 text-[#05B6C4] hover:underline mb-6"
                >
                  Lees het nieuwsbericht over dit evenement
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {event.photoGallery.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => window.open(photo, '_blank')}
                  >
                    <img
                      src={photo}
                      alt={`Foto ${index + 1} van ${event.title} ${event.previousYear}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
