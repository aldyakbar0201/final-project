'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [latitude, setLatitudeState] = useState<number | null>(null);
  const [longitude, setLongitudeState] = useState<number | null>(null);

  const setLatitude = (lat: number) => setLatitudeState(lat);
  const setLongitude = (lng: number) => setLongitudeState(lng);

  return (
    <LocationContext.Provider
      value={{ latitude, longitude, setLatitude, setLongitude }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
