'use client';

import { useEffect, useState, useContext } from 'react';
import { CartContext } from '@/context/cart-provider';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/component/hero-section';

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  storeId: number;
  createdAt: string;
  updatedAt: string;
  ProductImage: ProductImage[];
}

interface Category {
  id: number;
  name: string;
}

export default function ExplorePage() {
  const cart = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/products`,
      );
      const data = await res.json();
      setProducts(data);
    };
    const fetchCategories = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/categories`,
      );
      const data = await res.json();
      setCategories(data);
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const addProductToCart = async (productId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/cart`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ productId, quantity: 1 }),
        },
      );
      if (!response.ok) throw new Error('Failed to add product');
      cart?.setCartQuantity((prev) => (prev ? prev + 1 : 1));
      toast.success('Added to cart');
    } catch (error) {
      console.error(error);
      toast.error('Error adding to cart');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="py-6">
      <ToastContainer position="bottom-right" />
      <div className="container mx-auto px-4">
        {/* Banner */}
        <HeroSection />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="text-gray-700 hover:text-black cursor-pointer"
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-xl shadow overflow-hidden flex flex-col"
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative w-full h-48">
                      {product.ProductImage.length > 0 ? (
                        <Image
                          src={product.ProductImage[0].imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                          <ImageOff className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-700 font-bold">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => addProductToCart(product.id)}
                    className="mt-auto bg-blue-500 text-white p-3 text-sm font-semibold hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
