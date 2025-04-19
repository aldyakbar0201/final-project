'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function LocationPrompt() {
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
    <motion.section
      className="container mx-auto flex flex-col items-start text-left"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h2
        className="text-xl md:text-2xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Location
      </motion.h2>

      {locationError ? (
        <motion.p
          className="text-red-500 flex items-center text-base md:text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FaExclamationTriangle className="mr-2 text-red-500" />
          {locationError}
        </motion.p>
      ) : (
        <motion.p
          className="text-gray-700 flex items-center text-base md:text-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FaMapMarkerAlt className="mr-2 text-green-500" />
          {locationAddress || 'Fetching location...'}
        </motion.p>
      )}
    </motion.section>
  );
}
