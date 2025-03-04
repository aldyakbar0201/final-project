'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

//yang agak bingung nanti pasti jumlahnya harus nyambung sama backendnya (databasenya) itu nanti gimana?

export default function Cart() {
  const [order, setOrder] = useState(1);

  function handlePlus() {
    return setOrder(order + 1);
  }

  function handleMinus() {
    if (order === 1) {
      confirm('Are you sure to delete this product?');
    }

    return setOrder(order - 1);
  }

  return (
    <>
      <section className="m-20 gap-5">
        <h1 className="mb-10 text-5xl">Cart</h1>

        <div className="flex gap-8">
          {/* PRODUCT CARD */}
          <div className="mr-5 flex w-full items-center justify-between border-2 border-lime-600 p-5 px-10">
            <div className="flex items-center gap-10">
              <Image
                src={'/file.svg'}
                width={100}
                height={100}
                alt="dummy product"
              />
              <div className="flex flex-col gap-2">
                <h2 className="">Product Name</h2>
                <p>
                  descriptions <Link href={'/'}>see more</Link>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleMinus}
                className="h-8 w-8 rounded-full bg-lime-600 text-black"
              >{`<`}</button>
              <h2>{order}</h2>
              <button
                onClick={handlePlus}
                className="h-8 w-8 rounded-full bg-lime-600 text-black"
              >{`>`}</button>
            </div>
          </div>

          {/* TOTAL CARD */}
          <div className="relative w-[550px]">
            <h2 className="mb-2 text-3xl">Bill</h2>
            <div className="flex flex-col justify-between gap-10 border-2 border-lime-600 p-2">
              <div className="flex justify-between">
                <p>Product Name</p>
                <p>{`x ${order}`}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="rounded-md bg-lime-600 p-3 text-black"
              >
                Ceckout
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
