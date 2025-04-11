'use client';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

import { CartContext } from '@/context/cart-provider';
import { CartTotalPriceContext } from '@/context/cart-total-price-provider';
import { Bill } from '@/component/for-cart/bill';
import ItemDetails from '@/component/for-cart/item-details';

export default function Cart() {
  const cart = useContext(CartContext);
  const cartPrice = useContext(CartTotalPriceContext);
  const [localCart, setLocalCart] = useState(cart?.cartItems);

  useEffect(() => {
    setLocalCart(cart?.cartItems);
  }, [cart]);

  /* -------------------------------------------------------------------------- */
  /*                                     GET                                    */
  /* -------------------------------------------------------------------------- */
  // useEffect(() => {
  //   async function getCart() {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/v1/carts/11');
  //       const data = await response.json();
  //       // console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   getCart();
  // }, []);

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

  return (
    <section className="m-5 md:m-10 lg:m-20 min-h-screen">
      <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold">Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* PRODUCT CARD */}
        <div className="w-full lg:w-[70%]">
          {localCart?.length !== 0 ? (
            <div className="border-2 border-lime-600 p-5 flex flex-col gap-4">
              {localCart?.map((item) => (
                <ItemDetails
                  key={item?.Product?.id}
                  id={item?.Product?.id} // Use the product ID as the key
                  image={item?.Product?.ProductImage[0]?.imageUrl}
                  name={item?.Product?.name}
                  price={item?.Product?.price}
                  quantity={item?.quantity}
                  description={item?.Product?.description}
                  store={item?.Product?.Store?.name}
                  setTotalPrice={cartPrice?.setTotalPrice || (() => {})}
                  totalPrice={cartPrice?.totalPrice || 0}
                  setLocalCart={setLocalCart}
                />
              ))}
            </div>
          ) : (
            // Empty Cart Message Component
            <div className="w-full text-center py-10 border-2 border-lime-600 rounded-md">
              <h2 className="text-2xl font-semibold">
                No item is in the cart.
              </h2>
              <p className="text-gray-600 mt-2">
                Please look for items in our store.
              </p>
              <Link
                href="/"
                className="text-lime-600 hover:underline mt-4 inline-block"
              >
                Go to Store
              </Link>
            </div>
          )}
        </div>

        {/* TOTAL CARD */}
        <Bill />
      </div>
    </section>
  );
}
