import opencage from 'opencage-api-client';

export async function reverseGeocode(latitude: number, longitude: number) {
  try {
    const data = await opencage.geocode({
      q: `${latitude},${longitude}`,
      language: 'en',
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function geocode(address: string) {
  try {
    const data = await opencage.geocode({
      q: address,
      language: 'en',
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}
