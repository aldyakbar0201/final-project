'use client'; // Add this at the top of the file

import ProductList from '@/component/product-list';
import SearchBar from '@/component/search-bar';

export default function ProductsPage() {
  // Fungsi untuk menangani pencarian
  const handleSearch = (searchQuery: string) => {
    // Implementasikan logika pencarian di sini, misalnya filter produk berdasarkan searchQuery
    console.log('Search query:', searchQuery);
    // Misalnya, Anda bisa mengatur status untuk menampilkan produk yang difilter
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
      <SearchBar onSearch={handleSearch} /> {/* Pass handleSearch function */}
      <ProductList />
    </div>
  );
}
