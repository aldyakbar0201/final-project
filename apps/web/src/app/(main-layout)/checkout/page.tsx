'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensures Leaflet styles are loaded
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface SnapWindow extends Window {
  snap?: { embed: (token: string, options: { embedId: string }) => void };
}

export default function Checkout() {
  const mapRef = useRef<L.Map | null>(null); // Store map instance
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Store map container
  const { register } = useForm();

  /* -------------------------------------------------------------------------- */
  /*                                 POST TO DB                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function postOrders() {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/v1/orders',
          {
            //must be filled
          },
        );
        const data = response.data;

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    postOrders();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 MAP LEAFLET                                */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                                SNAP MIDTRANS                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement('script');
    script.src = `https://app.sandbox.midtrans.com/snap/snap.js`;
    script.setAttribute('data-client-key', midtransClientKey as string);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 SUBMIT DATA                                */
  /* -------------------------------------------------------------------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/v1/orders');
      const data = response.data;

      (window as SnapWindow).snap!.embed(data.data.transaction.token, {
        embedId: 'snap-container',
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="max-w-md mx-auto bg-white rounded-lg  p-6 my-8">
      <h2 className="text-2xl font-bold text-lime-600 mb-6 pb-3 border-b border-gray-200">
        Order Summary
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Checkout Items */}
          <div className="flex flex-col py-2">
            <span className="text-gray-700 font-medium mb-2">Location:</span>
            {/* Map container using useRef */}
            <div
              ref={mapContainerRef}
              className="w-full h-[300px] rounded-lg  border border-gray-200 overflow-hidden"
            ></div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="text-gray-700 font-medium">Delivery:</label>
            <select
              {...register('delivery')}
              className="text-gray-800 hover:text-lime-600 cursor-pointer transition-colors"
            >
              <option value=""></option>
            </select>
          </div>

          {/* ??? */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="text-gray-700 font-medium">Payment:</label>
            <select
              {...register('paymentType')}
              className="text-gray-800 font-medium"
            >
              <option value="Midtrans">Midtrans</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="text-gray-700 font-medium">Voucher:</label>
            <select {...register('voucher')} name="voucher">
              <option value=""></option>
            </select>
            {/* <span className="text-gray-800 hover:text-lime-600 cursor-pointer transition-colors">
              Pick Voucher →
            </span> */}
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="text-gray-700 font-medium">Discount:</label>
            <select {...register('discount')} className="text-gray-800">
              <option value=""></option>
            </select>
          </div>

          <div className="flex justify-between items-center pt-3">
            <span className="text-gray-800 font-bold text-lg">Total Cost:</span>
            <span className="text-xl font-bold text-lime-600">$13.97</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-lime-600 text-white py-3 rounded-lg font-medium hover:bg-lime-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50 "
        >
          Proceed to Payment
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-4">
        Secure payment processed by our trusted partners
      </p>
    </section>
  );
}
