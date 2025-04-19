'use client';

import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import { CartContext } from '@/context/cart-provider';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

interface Product {
  id: number;
  name: string;
  image: string | null;
  description: string;
  price: number;
  categoryId: number;
  storeId: number;
  ProductImage: {
    imageUrl: string;
  }[];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const cart = useContext(CartContext);

  const addProductToCart = async (productId: number) => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/product/cart',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: productId,
            quantity: 1,
          }),
          credentials: 'include',
        },
      );
      await response.json();

      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        cart?.setCartQuantity((prev) => (prev ? prev + 1 : 1));
        toast.success('Product added to cart successfully!');
      }
    } catch (error) {
      toast.error('Failed to add product to cart');
      console.error('Error adding product to cart:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/product/products',
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-gray-300 h-48 w-full" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-5/6" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                  <div className="h-10 bg-blue-300 rounded w-full mt-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.p
            className="text-red-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Error loading products: {error.message}
          </motion.p>
        </div>
      </section>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayedProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 6);

  return (
    <section className="py-12">
      <ToastContainer position="bottom-right" /> {/* Add ToastContainer here */}
      <div className="container mx-auto">
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(false);
            }}
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <motion.h2
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Products
          </motion.h2>
          {filteredProducts.length > 6 && !showAll && (
            <a
              href="/explore"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Show All
            </a>
          )}
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-full h-48">
                  {product.ProductImage[0].imageUrl ? (
                    <Image
                      src={product.ProductImage[0].imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-t-lg">
                      <ImageOff className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mt-4">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold mt-2">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <button
                  onClick={() => addProductToCart(product.id)}
                  disabled={!product.ProductImage[0].imageUrl}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
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
}
