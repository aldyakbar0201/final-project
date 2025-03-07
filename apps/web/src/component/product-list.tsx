// components/product-list.tsx
import Image from 'next/image';
import React from 'react';

const ProductList = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative w-full h-48">
              <Image
                src="/apple.jpg"
                alt="Product 1"
                fill
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>

            <h3 className="text-xl font-bold mt-4">Product 1</h3>
            <p className="text-gray-600">Description of Product 1</p>
            <p className="text-green-600 font-bold mt-2">$10.00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative w-full h-48">
              <Image
                src="/banana.jpg"
                alt="Product 1"
                fill
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>
            <h3 className="text-xl font-bold mt-4">Product 2</h3>
            <p className="text-gray-600">Description of Product 2</p>
            <p className="text-green-600 font-bold mt-2">$15.00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative w-full h-48">
              <Image
                src="/milk.jpg"
                alt="Product 1"
                fill
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>
            <h3 className="text-xl font-bold mt-4">Product 3</h3>
            <p className="text-gray-600">Description of Product 3</p>
            <p className="text-green-600 font-bold mt-2">$20.00</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
