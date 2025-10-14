'use client'

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export default function EventMap({ lat, lng, locationName, address }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window !== 'undefined' && mapRef.current && !mapRef.current._leaflet_id) {
      import('leaflet').then((L) => {
        // Initialize map
        const map = L.map(mapRef.current).setView([lat, lng], 15);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: #05B6C4; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                   <svg style="transform: rotate(45deg); width: 20px; height: 20px; fill: white;" viewBox="0 0 24 24">
                     <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                   </svg>
                 </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<b>${locationName}</b><br>${address}`)
          .openPopup();

        // Cleanup
        return () => {
          map.remove();
        };
      });
    }
  }, [lat, lng, locationName, address]);

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg overflow-hidden shadow-md"
        style={{ zIndex: 1 }}
      />
      
      {/* Address Below Map */}
      <div className="mt-4 flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
        <MapPin className="w-5 h-5 text-[#05B6C4] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gray-800">{locationName}</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      </div>
    </div>
  );
}
