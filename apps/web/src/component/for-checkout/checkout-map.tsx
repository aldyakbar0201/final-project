'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function CheckoutMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined')
      return;
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([0.7893, 113.9213], 5);
    mapRef.current = map;

    L.tileLayer(
      'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=SWVeTZR6GukfS4d2jhKd',
      {
        attribution: '© OpenStreetMap contributors',
      },
    ).addTo(map);

    const leafletIcon = L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      shadowSize: [50, 64],
      shadowAnchor: [4, 62],
    });

    const marker = L.marker([0.7893, 113.9213], {
      icon: leafletIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    marker.on('dragend', (event) => {
      const marker = event.target;
      console.log(marker.getLatLng());
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 17);
          marker.setLatLng([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden mb-6"
    />
  );
}
