'use client';
import { useState } from 'react';
import SearchBar from '@/component/search-bar';
import CategoryCard from '@/component/category-card';

const categories = [
  {
    title: 'Fresh Fruits & Vegetable',
    image: '/fresh-fruits.jpg',
    bgColor: 'bg-green-100 border-green-300',
  },
  {
    title: 'Cooking Oil & Ghee',
    image: '/cooking-oil.jpg',
    bgColor: 'bg-orange-100 border-orange-300',
  },
  {
    title: 'Meat & Fish',
    image: '/meat-fish.jpg',
    bgColor: 'bg-red-100 border-red-300',
  },
  {
    title: 'Bakery & Snacks',
    image: '/bakery.jpg',
    bgColor: 'bg-purple-100 border-purple-300',
  },
  {
    title: 'Dairy & Eggs',
    image: '/dairy-eggs.jpg',
    bgColor: 'bg-yellow-100 border-yellow-300',
  },
  {
    title: 'Beverages',
    image: '/beverages.jpg',
    bgColor: 'bg-blue-100 border-blue-300',
  },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter categories berdasarkan search
  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery),
  );

  return (
    <main className="p-6 pb-20 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-center mb-4">Find Products</h1>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {filteredCategories.map((cat, index) => (
          <CategoryCard
            key={index}
            title={cat.title}
            image={cat.image}
            bgColor={cat.bgColor}
          />
        ))}
      </div>
    </main>
  );
}
