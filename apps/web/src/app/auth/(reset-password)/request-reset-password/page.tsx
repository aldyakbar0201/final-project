'use client';
import { notify } from '@/utils/notify-toast';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function RequestResetPassword() {
  const [formEmail, setFormEmail] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleResetPassword() {
    try {
      setLoading(true);
      setFieldErrors({});

      const response = await fetch(
        'http://localhost:8000/api/v1/reset-password/request-reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formEmail),
          credentials: 'include',
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        return notify(errorData.message || 'Error sending reset link!');
      }
      notify('Reset link sent to your email');
    } catch (error) {
      console.error(error);
      setFieldErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setFormEmail({
        email: '',
      });
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full overflow-hidden rounded-xl">
        <div className="w-full md:w-1/2 p-8 my-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-80">
            Reset Password
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) =>
                  setFormEmail((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {fieldErrors.general && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.general}</p>
            )}
            <div className="flex items-center justify-center mb-4">
              <div className="border-t border-gray-300 w-full mr-4"></div>
              <span className="text-gray-500">OR</span>
              <div className="border-t border-gray-300 w-full ml-4"></div>
            </div>

            {/* Display error message if exists */}
            {fieldErrors.general && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.general}</p>
            )}
          </form>
          <div className="mt-4 text-center flex flex-col gap-2 justify-center">
            <Link
              href="/auth/user-login"
              className="text-blue-500 hover:text-blue-700"
            >
              Back To Login Page?
            </Link>
          </div>
        </div>
        {/* Optional Image Section */}
        {/* Uncomment the following section if you want to add an image similar to the login page */}
        <div className="relative w-1/2 h-full">
          <Image
            src="/fruit-2.jpg"
            alt="Fresh groceries"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
