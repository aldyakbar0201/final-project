'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Cart() {
  const [order, setOrder] = useState(1);
  const [price, setPrice] = useState(0);
  const [erase, setErase] = useState(false);

  function handlePlus() {
    setOrder(order + 1);
    setPrice((order + 1) * 1000);
  }

  function handleMinus() {
    if (order > 1) {
      setOrder(order - 1);
      setPrice((order - 1) * 1000);
    } else {
      if (confirm('Are you sure to delete this product?')) {
        setErase(!erase);
      }
    }
  }

  function handleErase() {
    if (confirm('Are you sure to delete this product?')) {
      setErase(!erase);
    }
  }

  return (
    <section className="m-5 md:m-10 lg:m-20 min-h-screen">
      <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold">Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* PRODUCT CARD */}
        <div className="w-full lg:w-[70%]">
          {!erase ? (
            <div className="border-2 border-lime-600 p-5 flex flex-col gap-4">
              {/* Single Product Card */}
              <div className="flex items-center justify-between">
                {/* Image - Always on the left */}
                <div className="relative flex-shrink-0 mr-4 w-28 h-28">
                  <Image
                    src={'/apple.jpg'}
                    fill
                    alt="dummy product"
                    className="rounded-md overflow-hidden object-cover"
                  />
                </div>

                {/* Product details - Centered and takes available space */}
                <div className="flex-grow flex flex-col gap-2">
                  <h2 className="text-lg font-semibold">Tomatos</h2>
                  <p className="text-sm text-gray-600">x2</p>
                  <div className="flex items-center mt-3">
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

                {/* Price and delete button - Always on the right */}
                <div className="flex flex-col items-end">
                  <span
                    className="text-xl w-5 h-5 cursor-pointer bg-red-600 p-2 rounded-md flex items-center justify-center text-white mb-7"
                    onClick={handleErase}
                  >
                    x
                  </span>
                  <p className="text-lg font-semibold">{`Rp${price}`}</p>
                </div>
              </div>
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
                href="/store"
                className="text-lime-600 hover:underline mt-4 inline-block"
              >
                Go to Store
              </Link>
            </div>
          )}
        </div>

        {/* TOTAL CARD */}
        <div className="w-full lg:w-[30%] sticky top-10 bg-white shadow-md p-4 border-2 border-lime-600">
          <h2 className="text-2xl font-semibold mb-2">Bill</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-lg">
              <p>Product Name</p>
              <p>{`x ${order}`}</p>
            </div>
            <p className="text-lg font-semibold">{`Rp${price},00`}</p>
            <button
              className={`w-full ${
                erase ? 'bg-gray-400 cursor-not-allowed' : 'bg-lime-600'
              } text-black py-2 text-lg rounded-md font-semibold hover:bg-lime-500 transition`}
              disabled={erase}
            >
              <Link href={'/checkout'} className="block w-full">
                Checkout
              </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
