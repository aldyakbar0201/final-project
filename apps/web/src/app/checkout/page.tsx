import React from 'react';

export default function Checkout() {
  return (
    <section className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
        Order Summary
      </h2>

      <div className="space-y-4">
        {/* Checkout Items */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 font-medium">Delivery</span>
          <span className="text-gray-800">Select Method</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 font-medium">Payment</span>
          <span className="text-gray-800">QRIS</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 font-medium">Voucher</span>
          <span className="text-gray-800">Pick discount</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b pb-4">
          <span className="text-gray-600 font-medium">Discount</span>
          <span className="text-gray-800">-</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-800 font-bold">Total Cost</span>
          <span className="text-lg font-bold text-lime-600">$13.97</span>
        </div>
      </div>

      <button className="w-full mt-6 bg-lime-600 text-white py-3 rounded-md font-medium hover:bg-lime-700 transition-colors">
        Proceed to Payment
      </button>
    </section>
  );
}
