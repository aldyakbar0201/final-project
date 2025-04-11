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
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemsType[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                     GET                                    */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function getCart() {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/carts/current',
        );
        const data = await response.json();
        setCartItems(data.CartItem);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */
// useEffect(() => {
//   async function updateCartItem() {
//     try {
//       const response = await fetch('http://localhost:8000/api/v1/carts/update', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ quantity, productId }),
//       });
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   updateCartItem();
// }, [order, price]);

/* -------------------------------------------------------------------------- */
/*                                   UPLOAD                                   */
/* -------------------------------------------------------------------------- */
// useEffect(() => {
//   async function postOrders() {
//     try {
//       const response = await axios.post('http://localhost:8000/api/v1/orders',{
//         //must be filled
//       });
//       const data = response.data;

//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }
// },[])
