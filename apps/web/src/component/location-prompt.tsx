// components/location-prompt.tsx
'use client';

import { useEffect, useState } from 'react';

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
    <section className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Location</h2>
      {locationError ? (
        <p className="text-red-500">{locationError}</p>
      ) : (
        <p className="text-gray-700">
          {locationAddress || 'Fetching location...'}
        </p>
      )}
    </section>
  );
};

export default LocationPrompt;
