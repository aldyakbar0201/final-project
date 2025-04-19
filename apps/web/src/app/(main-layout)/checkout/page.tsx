'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensures Leaflet styles are loaded
import { useForm } from 'react-hook-form';

// import { rajaOngkir } from '@/utils/raja-ongkir';

// 1. disini yang masih kurang proses midtrans sama manualnya
// 2. belum juga implementasi mekanisme untuk voucher dan discount (applyVoucher & applyDiscount)
// 3. belum ada geocodingnya untuk RajaOnkir

interface SnapWindow extends Window {
  snap?: { embed: (token: string, options: { embedId: string }) => void };
}

interface Voucher {
  id: number;
  code: string;
  type: 'PRODUCT_SPECIFIC' | 'TOTAL_PURCHASE' | 'SHIPPING';
  value: number;
  productId?: number | null;
  storeId?: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Discount {
  id: number;
  productId: number;
  storeId: number;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minPurchase: number;
  buyOneGetOne: boolean;
  maxDiscount: number;
  createdAt: string;
  updatedAt: string;
}

export default function Checkout() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const { register } = useForm();

  const mapRef = useRef<L.Map | null>(null); // Store map instance
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Store map container
  const markerRef = useRef<L.Marker | null>(null); // Store marker instance

  /* -------------------------------------------------------------------------- */
  /*                           GET VOUCHER & DISCOUNTS                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function getVouchers() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/vouchers');
        const data = await response.json();
        setVouchers(data.vouchers);
      } catch (error) {
        console.error(error);
      }
    }

    getVouchers();
  }, []);

  useEffect(() => {
    async function getDiscounts() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/discounts');
        const data = await response.json();
        setDiscounts(data.discounts);
        // console.log(data.discounts);
      } catch (error) {
        console.error(error);
      }
    }

    getDiscounts();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 POST TO DB                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function postOrders() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Add your order data here
            // For example:
            // productId: 1,
            // quantity: 2,
            // totalPrice: 200,
          }),
        });
        console.log(response);

        // console.log(data);
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

    // Initialize the map with default coordinates (will be updated if geolocation succeeds)
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
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      shadowSize: [50, 64],
      shadowAnchor: [4, 62],
    });

    // Create a draggable marker (initial position will be updated)
    const marker = L.marker([0.7893, 113.9213], {
      icon: leafletIcon,
      draggable: true, // Make the marker draggable
    }).addTo(map);

    markerRef.current = marker;

    // Add event listener for when the marker is moved
    marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      console.log(`Marker moved to: ${position.lat}, ${position.lng}`);
    });

    // Get user's current position using browser's geolocation API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // console.log(`User location: ${latitude}, ${longitude}`);

          // Update map view to user's location with street-level zoom (zoom level 15-18 is good for streets)
          map.setView([latitude, longitude], 17);

          // Update marker position to user's location
          marker.setLatLng([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
          // console.log('Using default coordinates instead');
        },
        {
          enableHighAccuracy: true, // Request high accuracy results
          timeout: 5000, // Wait up to 5 seconds for a position
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      console.error('Using default coordinates: 0.7893, 113.9213');
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

  /* -------------------------------------------------------------------------- */
  /*                                 RAJA ONKIR                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function getRajaOngkir() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/shippings/options?origin=55284&weight=5`,
        );

        const data = await response.json();
        setShippingOptions(data.data.data);
        // const data = await rajaOngkir('1000', '55284');
        // setShippingOptions(data);
        // console.log(data)
      } catch (error) {
        console.error(error);
      }
    }

    getRajaOngkir();
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
      const response = await fetch('http://localhost:8000/api/v1/orders', {
        // method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({ itemId, quantity }),
      });
      const data = await response.json();

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
              className="text-gray-800 hover:text-lime-600 cursor-pointer transition-colors border-2 border-gray-300 rounded-lg p-2 w-40"
            >
              <option value="pick delivery" disabled>
                -- Select a Delivery --
              </option>
              {shippingOptions.map(
                (option: { name: string; cost: number }, index) => (
                  <option key={index} value={option.name}>
                    {option.name} - {option.cost}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* ??? */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="text-gray-700 font-medium">Payment:</label>
            <select
              {...register('paymentType')}
              className="border-2 border-gray-300 rounded-lg p-2 w-40"
            >
              <option value="Midtrans">Midtrans</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="text-gray-700 font-medium">Voucher:</label>
            <select
              {...register('voucher')}
              name="voucher"
              className="border-2 border-gray-300 rounded-lg p-2 w-40"
            >
              <option value="pick voucher" disabled>
                -- Select a Voucher --
              </option>
              {vouchers?.map((voucher: Voucher) => (
                <option key={voucher.id} value={voucher.code}>
                  {voucher.code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="text-gray-700 font-medium">Discount:</label>
            <select
              {...register('discount')}
              name="discount"
              className="border-2 border-gray-300 rounded-lg p-2 w-40"
            >
              <option value="pick discount" disabled>
                -- Select a Discount --
              </option>
              {discounts?.map((discount: Discount) => (
                <option key={discount.id} value={discount.code}>
                  {discount.code}
                </option>
              ))}
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
