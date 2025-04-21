'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import {
  IoArrowBackOutline,
  IoShareOutline,
  IoHeartOutline,
} from 'react-icons/io5';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string | null;
  description: string;
  price: number;
  categoryId: number;
  storeId: number;
}

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product ID:', id);
        const res = await fetch(
          `http://localhost:8000/api/v1/product/products/${id}`,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch product (${res.status})`);
        }

        const data = await res.json();
        const productData = data.data || data;
        setProduct(productData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return <main className="p-4 min-h-screen">Loading...</main>;
  }

  if (error || !product) {
    return (
      <main className="p-4 min-h-screen text-red-500">
        Error: {error || 'Product not found'}
      </main>
    );
  }

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
      <div className="bg-gray-100 p-4 rounded-xl flex justify-center items-center">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-64 h-64 bg-gray-200 rounded-lg">
            <ImageOff className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-500">Price per item</p>
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
          <p className="text-2xl font-bold">
            Rp {(product.price * quantity).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-bold">Product Detail</h2>
        <p className="text-gray-500 text-sm mt-2">{product.description}</p>
      </div>

      {/* Nutritions */}
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
