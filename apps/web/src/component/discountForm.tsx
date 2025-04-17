'use client';

import { useState } from 'react';

export default function DiscountForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [isPercentage, setIsPercentage] = useState(false);
  const [minPurchase, setMinPurchase] = useState<number | ''>('');
  const [maxDiscount, setMaxDiscount] = useState<number | ''>('');
  const [isBuyOneGetOne, setIsBuyOneGetOne] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || amount <= 0) {
      setMessage('Nama dan jumlah diskon wajib diisi.');
      return;
    }

    const payload = {
      name,
      amount,
      isPercentage,
      minPurchase: minPurchase === '' ? null : Number(minPurchase),
      maxDiscount: isPercentage
        ? maxDiscount === ''
          ? null
          : Number(maxDiscount)
        : null,
      isBuyOneGetOne,
    };

    try {
      const res = await fetch('http://localhost:8000/api/v1/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage('Diskon berhasil ditambahkan!');
        // Reset form
        setName('');
        setAmount(0);
        setIsPercentage(false);
        setMinPurchase('');
        setMaxDiscount('');
        setIsBuyOneGetOne(false);
      } else {
        setMessage('Gagal menambahkan diskon.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat menyimpan diskon.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Buat Diskon Baru</h2>
      {message && <p className="text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Diskon</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Jumlah</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPercentage}
            onChange={(e) => setIsPercentage(e.target.checked)}
          />
          <label>Diskon dalam bentuk persentase (%)</label>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Minimal Pembelian (opsional)
          </label>
          <input
            type="number"
            value={minPurchase}
            onChange={(e) =>
              setMinPurchase(
                e.target.value === '' ? '' : parseFloat(e.target.value),
              )
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {isPercentage && (
          <div>
            <label className="block mb-1 font-medium">
              Maksimal Diskon (opsional)
            </label>
            <input
              type="number"
              value={maxDiscount}
              onChange={(e) =>
                setMaxDiscount(
                  e.target.value === '' ? '' : parseFloat(e.target.value),
                )
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isBuyOneGetOne}
            onChange={(e) => setIsBuyOneGetOne(e.target.checked)}
          />
          <label>Beli Satu Gratis Satu</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Diskon
        </button>
      </form>
    </div>
  );
}
