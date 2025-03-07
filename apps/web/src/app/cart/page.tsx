'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Cart() {
  const [order, setOrder] = useState(1);
  const [price, setPrice] = useState(0);
  const [erase, setErase] = useState(false);

  function handlePlus() {
    // const priceCatchUp = price + 1
    setOrder(order + 1);
    setPrice(order * 1000);
  }

  function handleMinus() {
    if (order > 1) {
      setOrder(order - 1);
      setPrice(order * 1000);
    } else {
      if (confirm('Are you sure to delete this product?')) {
        setErase(!erase);
      }
    }
  }

  return (
    <section className="m-5 md:m-10 lg:m-20">
      <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold">Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* PRODUCT CARD */}
        <div
          className={`${erase ? 'hidden' : 'flex'} w-full border-2 border-lime-600 p-5 flex-col md:flex-row md:items-center md:justify-between gap-4`}
        >
          <div
            className={`flex sm:flex-row items-center gap-4 sm:gap-10 ${erase ? 'hidden' : 'block'}`}
          >
            {/* Image */}
            <Image
              src={'/file.svg'}
              width={70}
              height={70}
              alt="dummy product"
            />
            {/* product details */}
            <div className="flex flex-col text-start sm:text-left">
              <h2 className="text-lg font-semibold">Product Name</h2>
              <p className="text-sm text-gray-600">descriptions</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={handleMinus}
                  className="h-5 w-5 rounded-full bg-lime-600 text-black flex items-center justify-center text-xl"
                >
                  -
                </button>
                <h2 className="w-12 text-center text-lg font-semibold">
                  {order}
                </h2>
                <button
                  onClick={handlePlus}
                  className="h-5 w-5 rounded-full bg-lime-600 text-black flex items-center justify-center text-xl"
                >
                  +
                </button>
              </div>
            </div>
            {/* Price */}
            <div className="flex flex-col items-end justify-end">
              <span
                className="text-xl relative top-0 cursor-pointer"
                onClick={() => {
                  setErase(!erase);
                }}
              >
                x
              </span>
              <p className="text-lg font-semibold">{`Rp${price}`}</p>
            </div>
          </div>
        </div>

        {/* TOTAL CARD */}
        <div className="w-full lg:w-[400px] border-2 border-lime-600 p-4">
          <h2 className="text-2xl font-semibold mb-2">Bill</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-lg">
              <p>Product Name</p>
              <p>{`x ${order}`}</p>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full bg-lime-600 text-black py-2 text-lg rounded-md font-semibold hover:bg-lime-500 transition"
            >
              <Link href={'/order'}>Checkout</Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
