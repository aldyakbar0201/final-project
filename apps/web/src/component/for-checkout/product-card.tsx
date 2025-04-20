'use client';

// import { useState } from 'react';
import Image from 'next/image';

interface CartProductProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function CartProduct({
  name,
  price,
  imageUrl,
}: CartProductProps) {
  // const [qty, setQty] = useState(quantity);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const totalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Image
          src={imageUrl || '/apple.png'}
          alt={name}
          width={80}
          height={80}
          className="object-cover rounded border"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="font-medium text-gray-800">{name}</h3>
        <div className="text-gray-500 text-sm mb-2">{formattedPrice}</div>

        {/* Quantity Controls */}
        <div className="flex items-center">
          <input
            type="text"
            // value={qty}
            readOnly
            className="w-10 h-8 border-y border-gray-300 text-center text-sm"
          />
        </div>
      </div>

      {/* Total Price */}
      <div className="flex-shrink-0 font-medium text-lime-600">
        {totalPrice}
      </div>
    </div>
  );
}
