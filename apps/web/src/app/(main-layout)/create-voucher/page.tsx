'use client';

import { useForm } from 'react-hook-form';

export default function CreateVoucherPage() {
  const { register, handleSubmit } = useForm();

  return (
    <section className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-lime-700 mb-6">Create Voucher</h1>
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="space-y-7"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Code
            <input
              {...register('code')}
              name="code"
              className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring focus:ring-lime-500 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type
            <select
              {...register('type')}
              name="type"
              className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring focus:ring-lime-500 focus:ring-opacity-50"
            >
              <option value="PRODUCT_SPECIFIC">Product Specific</option>
              <option value="TOTAL_PURCHASE">Total Purchase</option>
              <option value="SHIPPING">Shipping</option>
            </select>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Value
            <input
              {...register('value')}
              name="value"
              className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring focus:ring-lime-500 focus:ring-opacity-50"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors duration-200"
        >
          Create Voucher
        </button>
      </form>
    </section>
  );
}
