// /app/reports/components/DateFilter.tsx
'use client';

import { useState, useEffect } from 'react';

interface DateFilterProps {
  initialYear: number;
  initialMonth: number;
  initialStoreId: number | null;
  userRole: 'admin' | 'store_admin';
  stores: { id: number; name: string }[];
  onFilterChange: (year: number, month: number, storeId: number | null) => void;
}

export const DateFilter = ({
  initialYear,
  initialMonth,
  initialStoreId,
  userRole,
  stores,
  onFilterChange,
}: DateFilterProps) => {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [storeId, setStoreId] = useState<number | null>(initialStoreId);

  useEffect(() => {
    setYear(initialYear);
    setMonth(initialMonth);
    setStoreId(initialStoreId);
  }, [initialYear, initialMonth, initialStoreId]);

  const handleApply = () => {
    onFilterChange(year, month, storeId);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">Filter Laporan</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Tahun</label>
          <select
            className="p-2 border rounded w-full"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bulan</label>
          <select
            className="p-2 border rounded w-full"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString('id-ID', {
                  month: 'long',
                })}
              </option>
            ))}
          </select>
        </div>

        {userRole === 'admin' && (
          <div>
            <label className="block text-sm font-medium mb-1">Toko</label>
            <select
              className="p-2 border rounded w-full"
              value={storeId || ''}
              onChange={(e) =>
                setStoreId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Semua Toko</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleApply}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  );
};
