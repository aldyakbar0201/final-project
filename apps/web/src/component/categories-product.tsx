'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/product/categories',
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ width: '100%', height: '120px' }}
              ></motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 flex flex-col items-center justify-center text-center col-span-full">
              <p className="text-xl font-semibold text-gray-900 mb-4">
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Product Categories
          </motion.h2>
          <a
            href="/explore"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Show All
          </a>
        </div>

        {/* Use flex-wrap so items wrap on smaller screens */}
        <div className="flex flex-wrap gap-8 items-center justify-center">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="
                bg-gradient-to-r from-[#D1F8EF] to-[#A1E3F9]
                rounded-lg shadow-md p-6 
                flex flex-col items-center justify-center text-center 
                w-full max-w-xs 
                sm:w-[200px] sm:h-[120px]
                md:w-[250px] md:h-[150px]
                lg:w-[300px] lg:h-[150px]
              "
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-[8px]">
                {category.name}
              </h3>
              <p className="text-gray-[600]">
                Explore a wide range of {category.name} products.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
