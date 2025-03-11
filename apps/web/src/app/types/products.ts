// app/types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string; // Opsional: deskripsi produk
}
