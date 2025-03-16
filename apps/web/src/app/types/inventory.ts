// types/inventory.ts
export interface Product {
  id: string;
  name: string;
  stock: number;
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
}

export interface StockJournal {
  id: string;
  productId: string;
  storeId: string;
  change: number; // Perubahan stok (bisa positif atau negatif)
  timestamp: string;
}
