'use client';

import HeroSection from '@/component/hero-section';
import LocationPrompt from '@/component/location-prompt';
import ProductList from '@/component/product-list';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position.coords),
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(getLocationErrorMessage(error));
        },
        { timeout: 10000, maximumAge: 60000 },
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  function getLocationErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "You've denied permission to access your location. Please enable location access to see products from your nearest store.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable. We'll show you products from our main store.";
      case error.TIMEOUT:
        return "The request to get your location timed out. We'll show you products from our main store.";
      default:
        return "An unknown error occurred while trying to get your location. We'll show you products from our main store.";
    }
  }
  return (
    <section>
      <HeroSection />
      {locationError ? (
        <LocationPrompt message={locationError} />
      ) : !userLocation ? (
        <LocationPrompt message="Detecting your location..." />
      ) : null}
      <ProductList userLocation={userLocation} />
    </section>
  );
}
