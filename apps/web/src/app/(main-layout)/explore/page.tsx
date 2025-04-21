'use client';
import { useState, useEffect } from 'react';
import SearchBar from '@/component/search-bar';
import CategoryCard from '@/component/category-card';

export default function Explore() {
  const [categories, setCategories] = useState<
    { title: string; image: string; bgColor: string }[]
  >([]); // Menyimpan data kategori produk
  const [searchQuery, setSearchQuery] = useState(''); // Menyimpan query pencarian

  // Mengambil kategori produk dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Mengirimkan query pencarian sebagai parameter dalam request API
        const response = await fetch(
          `http://localhost:8000/api/v1/product/admin/categories?search=${searchQuery}`,
        );
        const data = await response.json();
        setCategories(data); // Menyimpan data kategori yang diterima
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [searchQuery]); // Efek ini dijalankan setiap kali searchQuery berubah

  console.log(categories);
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase()); // Memperbarui query pencarian untuk memfilter kategori
  };

  return (
    <main className="p-6 pb-20 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-center mb-4">Find Products</h1>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {categories.map((cat, index) => (
          <CategoryCard
            key={index}
            title={cat.title}
            image={cat.image || '/default-category-image.jpg'} // Gambar default jika tidak ada
            bgColor={cat.bgColor || 'bg-gray-100'} // Default warna latar belakang
          />
        ))}
      </div>
    </main>
  );
}
