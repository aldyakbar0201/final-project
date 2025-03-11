// components/product-list.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

// Data produk
const products = [
  {
    id: 1,
    name: 'Apple',
    image: '/apple.jpg',
    description: 'Description of Product 1',
    price: 10.0,
  },
  {
    id: 2,
    name: 'Banana',
    image: '/banana.jpg',
    description: 'Description of Product 2',
    price: 15.0,
  },
  {
    id: 3,
    name: 'Milk',
    image: '/milk.jpg',
    description: 'Description of Product 3',
    price: 20.0,
  },
];

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter produk berdasarkan input pencarian
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="py-12">
      <div className="container mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mt-4">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
