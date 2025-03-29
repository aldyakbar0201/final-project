import { getDistance } from 'geolib';

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  return (
    getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 },
    ) / 1000
  );
}

console.log(
  calculateDistance(
    -6.171866327429566,
    106.82134799481388,
    -6.270565,
    106.75955,
  ),
);
