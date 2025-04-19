// utils/api.ts
export async function rajaOngkir(weight: string, origin?: string) {
  const params = new URLSearchParams({
    weight: weight.toString(),
  });

  if (origin) params.append('origin', origin);

  const res = await fetch(`/api/shipping?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch shipping options');
  const { data } = await res.json();
  return data;
}
