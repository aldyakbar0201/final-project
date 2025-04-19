'use client';

import { ShoppingCart, User, ZoomIn, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
import { CartContext } from '@/context/cart-provider';
import { useContext } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cart = useContext(CartContext);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/me', {
          credentials: 'include',
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center relative">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Freshbasket
        </Link>

        {/* Burger menu icon */}
        <button
          className="lg:hidden flex items-center text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Menu className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Desktop menu */}
        <div className="items-center gap-6 hidden lg:flex">
          <motion.div whileHover={{ scale: 1.2 }}>
            <Link
              href="/explore"
              className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <ZoomIn className="w-6 h-6" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.2 }}>
            <Link
              href="/cart"
              className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
            </Link>
          </motion.div>

          {isLoggedIn ? (
            <motion.div whileHover={{ scale: 1.2 }}>
              <Link
                href="/user-profile"
                className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
              >
                <User className="w-6 h-6" />
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/auth/user-login"
                className="text-gray-700 font-semibold hover:text-blue-500 transition-colors"
              >
                Login / Register
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile menu */}
        <div
          className={`absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-6 lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'flex' : 'hidden'
          }`}
        >
          <Link
            href="/explore"
            className="text-gray-600 hover:text-blue-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore
          </Link>
          <Link href="/cart" className="flex items-center relative">
            <ShoppingCart className="w-6 h-6 mr-1" />
            <span className="sr-only">Cart</span>
            {cart?.cartQuantity ? (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.cartQuantity}
              </div>
            ) : null}
          </Link>
          {isLoggedIn ? (
            <Link
              href="/user-profile"
              className="text-gray-600 hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth/user-login"
              className="text-gray-700 font-semibold hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
