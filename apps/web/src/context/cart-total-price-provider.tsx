'use client';

import { createContext, useState, useEffect } from 'react';

import { CartItems } from '@/app/types/cart';

interface CartTotalPriceContextType {
  totalPrice: number;
  setTotalPrice: (price: number) => void;
}

export const CartTotalPriceContext = createContext<
  CartTotalPriceContextType | undefined
>(undefined);

export const CartTotalPriceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  /* -------------------------------------------------------------------------- */
  /*                                     GET                                    */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function getCart() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/carts/current`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await response.json();
        setCartItems(data.CartItem);
      } catch (error) {
        console.error(error);
      }
    }

    getCart();
  }, []);

  useEffect(() => {
    const newTotalPrice = cartItems?.reduce((acc, curr) => {
      return acc + (curr?.Product?.price ?? 0) * (curr?.quantity ?? 0);
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  return (
    <CartTotalPriceContext.Provider
      value={{
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </CartTotalPriceContext.Provider>
  );
};
