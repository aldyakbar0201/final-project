'use client';

import { createContext, useState, useEffect } from 'react';

interface CartItemsType {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  Product: {
    id: number;
    name: string;
    price: number;
    description: string;
    Store: { name: string };
    ProductImage: { imageUrl: string }[];
  };
  createdAt: string;
  updatedAt: Date;
}

interface CartContextType {
  cartItems: CartItemsType[];
  cartQuantity: number | null;
  setCartQuantity: React.Dispatch<React.SetStateAction<number | null>>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemsType[]>([]);
  const [cartQuantity, setCartQuantity] = useState<number | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                     GET                                    */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function getCart() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/carts/current`,
          {
            credentials: 'include',
          },
        );
        const data = await response.json();

        setCartItems(data.CartItem);
        if (data && data.CartItem) {
          setCartQuantity(
            data.CartItem.reduce((acc: number, curr: CartItemsType) => {
              return acc + curr.quantity;
            }, 0),
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartQuantity,
        setCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
