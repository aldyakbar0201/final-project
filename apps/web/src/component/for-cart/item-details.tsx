'use client';

import { CartItems } from '@/app/types/cart';
import Image from 'next/image';
import { useState } from 'react';

export default function ItemDetails({
  image,
  id,
  name,
  price,
  quantity,
  store,
  description,
  setTotalPrice,
  totalPrice,
  setLocalCart,
}: {
  image: string;
  id: number;
  name: string;
  price: number;
  quantity: number;
  store: string;
  description: string;
  setTotalPrice: (price: number) => void;
  totalPrice: number;
  setLocalCart: (cart: CartItems[]) => void;
}) {
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [itemPrice, setItemPrice] = useState(price * quantity);

  function handlePlus(price: number) {
    setItemQuantity(itemQuantity + 1);
    setItemPrice((itemQuantity + 1) * price);
    setTotalPrice(totalPrice + price);
  }

  function handleMinus(price: number) {
    if (itemQuantity > 1) {
      setItemQuantity(itemQuantity - 1);
      setItemPrice((itemQuantity - 1) * price);
      setTotalPrice(totalPrice - price);
    }
  }

  function handleRemove() {
    if (confirm('Are you sure to delete this product?')) {
      // @ts-expect-error don't know yet
      setLocalCart((prev) => prev.filter((item) => item.Product.id !== id));
      setTotalPrice(totalPrice - itemPrice);
    }
  }

  return (
    <div className="flex items-center justify-between">
      {/* Image - Always on the left */}
      <div className="relative flex-shrink-0 mr-7 w-32 h-32">
        <Image
          src={
            image ||
            'https://images.unsplash.com/photo-1742590794223-5e55f1c9e63f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          fill
          alt="dummy product"
          className="rounded-md overflow-hidden object-cover"
        />
      </div>
      {/* Product details - Centered and takes available space */}
      <div className="flex-grow flex flex-col gap-2">
        <h4 className="text-sm font-bold">{store}</h4>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center mt-3">
          <button
            onClick={() => handleMinus(price)}
            className="h-5 w-5 rounded-full bg-lime-600 text-black flex items-center justify-center text-xl"
          >
            -
          </button>
          <h2 className="w-12 text-center text-lg font-semibold">
            {itemQuantity}
          </h2>
          <button
            onClick={() => handlePlus(price)}
            className="h-5 w-5 rounded-full bg-lime-600 text-black flex items-center justify-center text-xl"
          >
            +
          </button>
        </div>
      </div>
      {/* Price and delete button - Always on the right */}
      <div className="flex flex-col items-end">
        <span
          className="text-xl w-5 h-5 cursor-pointer bg-red-600 p-2 rounded-md flex items-center justify-center text-white mb-7"
          onClick={handleRemove}
        >
          x
        </span>
        <p className="text-lg font-semibold">{`Rp${itemPrice}`}</p>
      </div>
    </div>
  );
}
