'use client';

import { useEffect, useState, useRef, useContext } from 'react';
import { CartContext } from '@/context/cart-provider';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensures Leaflet styles are loaded
import { useForm } from 'react-hook-form';
// import Image from 'next/image';
import Products from '@/component/for-checkout/product-card';

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
  const { register, watch } = useForm();
  const paymentType = watch('paymentType');
  const voucherExistance = watch('voucher');
  const discountExistance = watch('discount');

  const cart = useContext(CartContext);

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
      } catch (error) {
        console.error(error);
      }
    }

    getDiscounts();
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
      marker.getLatLng();
    });

    // Get user's current position using browser's geolocation API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update map view to user's location with street-level zoom (zoom level 15-18 is good for streets)
          map.setView([latitude, longitude], 17);

          // Update marker position to user's location
          marker.setLatLng([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
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
    <section className="container mx-auto py-8 px-4">
      <div className="text-3xl font-bold text-gray-800 mb-6">Checkout</div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Shipping Address & Map */}
        <div className="md:w-2/3 bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              ALAMAT PENGIRIMAN
            </h2>
            <div className="flex items-start gap-2 mb-2">
              <div className="text-lime-600 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Home Address • user</div>
                <div className="text-gray-600 text-sm">user adress</div>
              </div>
            </div>
            <button className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
              Change
            </button>
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden mb-6"
          ></div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Products
            </h2>
            {/* <div className="flex items-center gap-4 border-b pb-4">
              <div className="flex-shrink-0">
                <Image
                  src="/apple.jpg"
                  alt="Product"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">
                  TP-Link TL-WA860RE - 300Mbps WiFi Range Extender dengan AC
                  Passthrough
                </h3>
                <div className="text-gray-600 text-sm">1 x Rp307.000</div>
              </div>
            </div> */}
            <Products
              id={1}
              name="Sample Product"
              price={100000}
              quantity={1}
              imageUrl="/path/to/image.jpg"
            />
          </div>
        </div>

        {/* Right Column - Payment Methods & Order Summary */}
        <div className="md:w-1/3">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex justify-between items-center">
                Metode Pembayaran
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Midtrans"
                    {...register('paymentType')}
                    className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                  />
                  <label className="text-gray-700 cursor-pointer">
                    Midtrans
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Manual"
                    {...register('paymentType')}
                    className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                  />
                  <label className="text-gray-700 cursor-pointer">
                    Manual Transfer
                  </label>
                </div>
                {paymentType === 'Manual' && (
                  <div className="mt-4">
                    <label className="block text-gray-700 mb-2">
                      Upload Payment Proof
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="border-2 border-gray-300 rounded-lg p-2 w-full"
                      placeholder="Proof of Payment"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex justify-between items-center">
                Other Price
              </h2>
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Shipping</label>
                <select
                  {...register('delivery')}
                  className="border-2 border-gray-300 rounded-lg p-2 w-full"
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

              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Voucher</label>
                <select
                  {...register('voucher')}
                  className="border-2 border-gray-300 rounded-lg p-2 w-full"
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

              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Discount</label>
                <select
                  {...register('discount')}
                  className="border-2 border-gray-300 rounded-lg p-2 w-full"
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
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Ringkasan Belanja
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">
                    Total Harga ({cart?.cartQuantity || 1} barang)
                  </span>
                  <span className="text-gray-800 font-medium">price</span>
                </div>

                {voucherExistance !== 'pick voucher' && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Apply Voucher</span>
                    <span className="text-gray-800 font-medium">Rp7.500</span>
                  </div>
                )}

                {discountExistance !== 'pick discount' && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Apply Discount</span>
                    <span className="text-gray-800 font-medium">Rp1.900</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-800 font-bold text-lg">
                    Total Tagihan
                  </span>
                  <span className="text-xl font-bold text-lime-600">
                    Rp316.400
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-lime-600 text-white py-3 rounded-lg font-medium hover:bg-lime-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50"
              >
                Bayar Sekarang
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Dengan melanjutkan, saya setuju dengan syarat & ketentuan yang
                berlaku
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
