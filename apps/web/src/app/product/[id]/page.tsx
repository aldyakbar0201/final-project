'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import {
  IoArrowBackOutline,
  IoShareOutline,
  IoHeartOutline,
} from 'react-icons/io5';

export default function ProductDetail() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <main className="p-4 min-h-screen bg-white">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()}>
          <IoArrowBackOutline size={24} />
        </button>
        <button>
          <IoShareOutline size={24} />
        </button>
      </div>

      {/* Product Image */}
      <div className="bg-gray-100 p-4 rounded-xl">
        <img
          src="/apple.jpg"
          alt="Naturel Red Apple"
          className="w-full rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="mt-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Naturel Red Apple</h1>
            <p className="text-gray-500">1kg, Price</p>
          </div>
          <button>
            <IoHeartOutline size={24} />
          </button>
        </div>

        {/* Quantity & Price */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDecrease}
              className="p-2 bg-gray-200 rounded-full"
            >
              −
            </button>
            <span className="text-xl font-bold">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="p-2 bg-green-500 text-white rounded-full"
            >
              +
            </button>
          </div>
          <p className="text-2xl font-bold">$4.99</p>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-bold">Product Detail</h2>
        <p className="text-gray-500 text-sm mt-2">
          Apples are nutritious. Apples may be good for weight loss. Apples may
          be good for your heart. As part of a healthful and varied diet.
        </p>
      </div>

      {/* Nutrition */}
      <div className="mt-4 border-t pt-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Nutritions</h2>
        <button className="bg-gray-200 px-3 py-1 rounded-full text-sm">
          100gr
        </button>
      </div>

      {/* Review */}
      <div className="mt-4 border-t pt-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Review</h2>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
      </div>

      {/* Add to Basket */}
      <button className="mt-6 w-full bg-green-500 text-white py-3 text-lg font-bold rounded-lg">
        Add To Basket
      </button>
    </main>
  );
}
