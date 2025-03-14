// components/location-prompt.tsx
'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LocationPrompt = () => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const data = await response.json();
            if (data.address) {
              const district =
                data.address.suburb || data.address.village || '';
              const city =
                data.address.city ||
                data.address.town ||
                data.address.county ||
                '';
              setLocationAddress(`${district}, ${city}`.trim());
            } else {
              setLocationAddress('Location not found');
            }
          } catch (error) {
            console.error(error);
            setLocationError('Failed to fetch location data.');
          }
        },
        (error) => {
          setLocationError(error.message);
        },
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <section className="mx-8 mt-10 p-6">
      <motion.h2
        className="text-2xl font-bold mb-4 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaMapMarkerAlt className="mr-2 text-blue-500" />
        Your Location
      </motion.h2>
      {locationError ? (
        <motion.p
          className="text-red-500 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaExclamationTriangle className="mr-2 text-red-500" />
          {locationError}
        </motion.p>
      ) : (
        <motion.p
          className="text-gray-700 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaMapMarkerAlt className="mr-2 text-green-500" />
          {locationAddress || 'Fetching location...'}
        </motion.p>
      )}
    </section>
  );
};

export default LocationPrompt;
