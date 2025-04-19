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

  return (
    <section className="m-5 md:m-10 lg:m-20 min-h-screen">
      <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold">Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* PRODUCT CARD */}
        <div className="w-full lg:w-[70%]">
          {localCart?.length !== 0 ? (
            <div className=" flex flex-col gap-4">
              {localCart?.map((item) => (
                <ItemDetails
                  key={item?.Product?.id}
                  cartItemId={item?.id}
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
                  setCartQuantity={cart?.setCartQuantity || (() => {})}
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
