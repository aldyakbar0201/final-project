import opencage from 'opencage-api-client';

export async function convertCoordinateToAddress(
  latitude: number,
  longitude: number,
) {
  try {
    const data = await opencage.geocode({
      q: `${latitude},${longitude}`,
      language: 'en',
      key: process.env.OPENCAGE_API_KEY,
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function convertAddressToCoordinate(address: string) {
  try {
    const data = await opencage.geocode({
      q: address,
      language: 'en',
      key: process.env.OPENCAGE_API_KEY,
    });

    return data.results[0].geometry;
  } catch (error) {
    console.error(error);
  }
}
