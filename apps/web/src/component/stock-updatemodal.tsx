// components/StockUpdateModal.tsx
import { useState } from 'react';
import { Product } from '../app/types/inventory';

interface StockUpdateModalProps {
  product: Product;
  onClose: () => void;
}

export default function StockUpdateModal({
  product,
  onClose,
}: StockUpdateModalProps) {
  const [change, setChange] = useState<number>(0);

  const handleUpdateStock = () => {
    // Logika untuk memperbarui stok dan membuat jurnal
    console.log(`Memperbarui stok ${product.name} sebesar ${change}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Perbarui Stok</h2>
        <p className="mb-4">Produk: {product.name}</p>
        <input
          type="number"
          value={change}
          onChange={(e) => setChange(Number(e.target.value))}
          className="p-2 border rounded-lg mb-4"
          placeholder="Masukkan perubahan stok"
        />
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="text-gray-500">
            Batal
          </button>
          <button
            onClick={handleUpdateStock}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
