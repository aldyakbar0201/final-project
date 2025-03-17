'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensures Leaflet styles are loaded

export default function Checkout() {
  const mapRef = useRef<L.Map | null>(null); // Store map instance
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Store map container

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return; // Prevent multiple initializations

    // Initialize the map
    const map = L.map(mapContainerRef.current).setView([0.7893, 113.9213], 5);
    mapRef.current = map; // Store map instance

    L.tileLayer(
      'https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=SWVeTZR6GukfS4d2jhKd',
      {
        attribution: '© OpenStreetMap contributors ',
      },
    ).addTo(map);

    const leafletIcon = L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowAnchor: [6, 63],
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    });

    L.marker([0.7893, 113.9213], { icon: leafletIcon }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="max-w-md mx-auto bg-white rounded-lg shadow-md py-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
        Order Summary
      </h2>

      <div className="space-y-4">
        {/* Checkout Items */}
        <div className="flex flex-col py-2">
          <span className="text-gray-600 font-medium mb-2">Location:</span>
          {/* Map container using useRef */}
          <div
            ref={mapContainerRef}
            className="w-full h-[300px] rounded-lg shadow-md"
          ></div>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 font-medium">Delivery:</span>
          <span className="text-gray-800">Select Method</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 font-medium">Payment:</span>
          <span className="text-gray-800">QRIS</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 font-medium">Voucher:</span>
          <span className="text-gray-800">Pick Voucher</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b pb-4">
          <span className="text-gray-600 font-medium">Discount:</span>
          <span className="text-gray-800">-</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-800 font-bold">Total Cost:</span>
          <span className="text-lg font-bold text-lime-600">$13.97</span>
        </div>
      </div>

      <button className="w-full mt-6 bg-lime-600 text-white py-3 rounded-md font-medium hover:bg-lime-700 transition-colors">
        Proceed to Payment
      </button>
    </section>
  );
}
