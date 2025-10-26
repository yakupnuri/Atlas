'use client'

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, AlertCircle } from 'lucide-react';

export default function GoogleMap({ 
  apiKey, 
  address = 'Amsterdam, Netherlands',
  lat = 52.3676,
  lng = 4.9041,
  height = '400px' 
}) {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiKey) {
      setError('Google Maps API key niet geconfigureerd');
      setLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
        });

        const google = await loader.load();
        
        const location = { lat, lng };
        
        const map = new google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
        
        // Add marker
        new google.maps.Marker({
          position: location,
          map: map,
          title: address,
          animation: google.maps.Animation.DROP
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Google Maps error:', err);
        setError('Map kon niet geladen worden');
        setLoading(false);
      }
    };

    initMap();
  }, [apiKey, lat, lng, address]);

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Map niet beschikbaar</h3>
            <p className="text-sm text-yellow-700">
              {error}. Configureer de Google Maps API key in Settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-3 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Map laden...</p>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
