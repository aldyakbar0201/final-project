'use client';

import { useEffect, useState } from 'react';
import { Discount } from '@/app/types/discount';

export default function DiscountList() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discounts`,
      );
      const json = await res.json();
      console.log('DATA DARI BACKEND:', json);
      if (json?.data) {
        setDiscounts(json.data);
      } else {
        setDiscounts([]);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data diskon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus diskon ini?')) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/discounts/${id}`, {
        method: 'DELETE',
      });
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert('Gagal menghapus diskon');
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Manajemen Diskon</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Tipe</th>
            <th className="border px-4 py-2">Jumlah</th>
            <th className="border px-4 py-2">Minimal Pembelian</th>
            <th className="border px-4 py-2">Maks Diskon</th>
            <th className="border px-4 py-2">B1G1</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.id}>
              <td className="border px-4 py-2">{discount.name}</td>
              <td className="border px-4 py-2">
                {discount.isPercentage ? 'Persentase' : 'Nominal'}
              </td>
              <td className="border px-4 py-2">{discount.amount}</td>
              <td className="border px-4 py-2">
                {discount.minPurchase ? `Rp${discount.minPurchase}` : '-'}
              </td>
              <td className="border px-4 py-2">
                {discount.maxDiscount ? `Rp${discount.maxDiscount}` : '-'}
              </td>
              <td className="border px-4 py-2">
                {discount.isBuyOneGetOne ? '✅' : '-'}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(discount.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
