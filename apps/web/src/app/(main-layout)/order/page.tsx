import Image from 'next/image';

export default function Order() {
  return (
    <>
      <section className="m-20">
        <h1 className="text-5xl font-bold">Orders</h1>
        {/* CARD */}
        <div className="mt-5 border-2 border-lime-600 p-5 rounded-xl">
          {/* HEADER */}
          <div className="flex gap-10 mb-4 px-2 border-b-2 items-center">
            <h3 className="text-2xl">Order 1</h3>
            <span>Completed</span>
            <span>18 / 12 / 2001</span>
          </div>
          {/* PRODUCT */}
          <div className="flex justify-between">
            {/* PRODUCT MAIN */}
            <div className="flex gap-3">
              <Image
                src={'/home.svg'}
                width={100}
                height={100}
                alt="dummy product image"
                className="bg-white p-3"
              />
              <div>
                <p className="text-2xl font-bold">
                  Banana, Tomato, Mushroom, Potato, Lettuce
                </p>
                <p>x2, x3, x1, x1, x5</p>
              </div>
            </div>
            {/* TOTAL PRICE */}
            <div className="mr-20 my-2">
              <p className="text-xl font-bold">Total Price</p>
              <p className="text-lg">Rp50.000</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
