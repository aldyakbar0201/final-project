'use client';
import { ShoppingCart, User, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
import { CartContext } from '@/context/cart-provider';
import { useContext } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  // const { data } = useSession();
  const cart = useContext(CartContext);

  useEffect(() => {
    // Fetch user authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          setIsLoggedIn(true); // User is logged in
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Freshbasket
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/explore" className="flex items-center">
            <ZoomIn className="w-6 h-6 mr-1" />
            <span className="sr-only">Explore</span>
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
            <Link href="/user-profile" className="flex items-center">
              <User className="w-6 h-6 mr-1" />
              <span className="sr-only">Profile</span>
            </Link>
          ) : (
            <Link
              href="/auth/user-login"
              className="text-gray-700 hover:text-blue-500"
            >
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
