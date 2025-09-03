
import React, { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

const MapView = ({ rides = [] }) => {
  const mapRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // Mock map implementation
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" class="w-full h-full">
              <!-- Mock roads -->
              <path d="M50 150 Q200 100 350 150" stroke="#4F46E5" stroke-width="3" fill="none" opacity="0.6"/>
              <path d="M100 50 Q200 150 300 250" stroke="#059669" stroke-width="3" fill="none" opacity="0.6"/>
              <path d="M50 250 Q200 200 350 50" stroke="#DC2626" stroke-width="3" fill="none" opacity="0.6"/>
              
              <!-- Mock cities -->
              <circle cx="100" cy="150" r="8" fill="#4F46E5"/>
              <circle cx="200" cy="120" r="8" fill="#059669"/>
              <circle cx="300" cy="180" r="8" fill="#DC2626"/>
              
              <!-- Mock route markers -->
              <circle cx="150" cy="135" r="4" fill="#F59E0B"/>
              <circle cx="250" cy="150" r="4" fill="#F59E0B"/>
            </svg>
          </div>
          <div class="text-center z-10">
            <div class="text-2xl mb-2">🗺️</div>
            <p class="text-gray-600 font-medium">Interaktive Karte</p>
            <p class="text-sm text-gray-500">Zeigt verfügbare Routen</p>
          </div>
        </div>
      `;
    }

    // Show toast for map interaction
    const handleMapClick = () => {
      toast({
        title: "🚧 Vollständige Kartenintegration kommt bald",
        description: "OpenStreetMap-Integration kann in deinem nächsten Prompt angefordert werden! 🚀",
      });
    };

    if (mapRef.current) {
      mapRef.current.addEventListener('click', handleMapClick);
      return () => {
        if (mapRef.current) {
          mapRef.current.removeEventListener('click', handleMapClick);
        }
      };
    }
  }, [rides, toast]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full cursor-pointer"
      style={{ minHeight: '300px' }}
    />
  );
};

export default MapView;
