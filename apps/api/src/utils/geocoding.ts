import axios from 'axios';

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

/**
 * Geocodes an address to get latitude and longitude
 * @param street Street address
 * @param city City name
 * @param postalCode Postal code
 * @returns Promise with latitude and longitude
 */
export async function geocodeAddress(
  street: string,
  city: string,
  postalCode: number,
): Promise<GeocodingResult> {
  try {
    // Format the address for the geocoding API
    const formattedAddress = `${street}, ${city}, ${postalCode}, Indonesia`;

    // Make a request to a geocoding API
    // Note: You should replace this URL with your preferred geocoding service
    // This example uses OpenStreetMap Nominatim API which is free but has usage limits
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: formattedAddress,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'FreshBasket/1.0', // Required by Nominatim
        },
      },
    );

    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      };
    }

    // Fallback to default coordinates for Jakarta if geocoding fails
    console.warn(
      `Geocoding failed for address: ${formattedAddress}. Using default coordinates.`,
    );
    return {
      latitude: -6.2088,
      longitude: 106.8456,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to default coordinates for Jakarta
    return {
      latitude: -6.2088,
      longitude: 106.8456,
    };
  }
}
