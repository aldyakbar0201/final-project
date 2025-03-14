// components/product-list.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Data produk
const products = [
  {
    id: 1,
    name: 'Apple',
    image: '/apple.jpg',
    description: 'Fresh and juicy apple.',
    price: 10.0,
  },
  {
    id: 2,
    name: 'Banana',
    image: '/banana.jpg',
    description: 'Ripe and sweet banana.',
    price: 15.0,
  },
  {
    id: 3,
    name: 'Milk',
    image: '/milk.jpg',
    description: 'Fresh milk from local farms.',
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
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        <motion.h2
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Products
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
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
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              No products found.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductList;
