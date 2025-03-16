// app/inventory/page.tsx
'use client';

import { useState } from 'react';
import InventoryTable from '../../../component/inventory-table';
import StoreSelector from '../../../component/store-selector';
import { Product, Store } from '../../types/inventory';

// Data contoh toko dan produk
const stores: Store[] = [
  { id: '1', name: 'Toko A' },
  { id: '2', name: 'Toko B' },
];

const products: Product[] = [
  { id: '1', name: 'Produk 1', stock: 10, storeId: '1' },
  { id: '2', name: 'Produk 2', stock: 5, storeId: '1' },
  { id: '3', name: 'Produk 3', stock: 20, storeId: '2' },
];

export default function InventoryPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filter produk berdasarkan toko yang dipilih
  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    const filtered = products.filter((product) => product.storeId === store.id);
    setFilteredProducts(filtered);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {/* Pilih toko (hanya untuk admin utama) */}
      <StoreSelector stores={stores} onSelectStore={handleStoreSelect} />

      {/* Tabel inventory */}
      {selectedStore ? (
        <InventoryTable products={filteredProducts} store={selectedStore} />
      ) : (
        <p className="text-gray-500">Silakan pilih toko terlebih dahulu.</p>
      )}
    </div>
  );
}
