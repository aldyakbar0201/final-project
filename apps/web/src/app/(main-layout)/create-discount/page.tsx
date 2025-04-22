'use client';

import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';

interface CreateDiscountFormData {
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  maxDiscount: number;
}

export default function CreateDiscountPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDiscountFormData>();
  const created = () => toast('The Voucher is Created!');

  async function CreateDiscount(data: CreateDiscountFormData) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vouchers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: data.code,
            type: data.type,
            value: data.value,
            maxDiscount: data.maxDiscount,
          }),
        },
      );

      await response.json();
      if (response.ok) {
        created();
        // console.log(responseData);
      } else {
        toast.error('Failed to create voucher');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-2xl border-2 border-green-700">
      <ToastContainer />

      <h1 className="text-2xl font-bold text-lime-600 mb-6 text-center">
        Create Discount
      </h1>
      <form onSubmit={handleSubmit(CreateDiscount)} className="space-y-4">
        {/* Code Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Code
            <input
              {...register('code', {
                required: 'Code is required',
                maxLength: {
                  value: 10,
                  message: 'Code must be at most 10 characters',
                },
              })}
              name="code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
            />
          </label>
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>

        {/* Type Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type
            <select
              {...register('type', { required: 'Type is required' })}
              name="type"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
            </select>
          </label>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        {/* Value Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Value
            <input
              {...register('value', {
                required: 'Value is required',
                min: { value: 0, message: 'Value must be greater than 0' },
              })}
              name="value"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
            />
          </label>
          {errors.value && (
            <p className="text-red-500 text-sm">{errors.value.message}</p>
          )}
        </div>

        {/* Max Discount Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Max. Discount
            <input
              {...register('maxDiscount', {
                required: 'Max Discount is required',
                min: {
                  value: 0,
                  message: 'Max Discount must be greater than 0',
                },
              })}
              name="maxDiscount"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
            />
          </label>
          {errors.maxDiscount && (
            <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors duration-200"
        >
          Create Discount
        </button>
      </form>
    </section>
  );
}
