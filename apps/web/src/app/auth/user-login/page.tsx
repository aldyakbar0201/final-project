'use client';
import { notify } from '@/utils/notify-toast';
import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formLogin),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        return notify(errorData.message || 'Error login!');
      }
      notify('Login successfull');
      // router.push('/');
    } catch (error) {
      console.log(error);
      setFieldErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setFormLogin({
        email: '',
        password: '',
      });
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full overflow-hidden rounded-xl">
        <div className="w-full md:w-1/2 p-8 my-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
          <form onSubmit={handleLogin}>
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
                  setFormLogin((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formLogin.password}
                onChange={(e) =>
                  setFormLogin((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="flex items-center justify-center mb-4">
              <div className="border-t border-gray-300 w-full mr-4"></div>
              <span className="text-gray-500">OR</span>
              <div className="border-t border-gray-300 w-full ml-4"></div>
            </div>
            <button
              type="button"
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.643 9c-.111-.004-.222-.004-.333-.004-4.216 0-7.765 2.67-9.64 6.499.359.078.719.118 1.079.118.573 0 1.136-.102 1.643-.294-.209-.677-.823-1.212-1.504-1.212-.938 0-1.694.492-2.093 1.136l-.008.04c-.266.96-.83 1.725-1.566 2.165h-.004c-.77.443-1.694.638-2.697.638-2.091 0-3.865-1.388-4.39-3.182C.689 9.099 1.322 7.862 2.167 7.088c.745-.773 1.866-1.297 3.042-1.297 1.02 0 1.936.427 2.538 1.118.603-.691 1.524-1.118 2.538-1.118 2.209 0 4.129 1.434 4.927 3.227zm-8.254 4.002c-.183-.409-.486-.75-.891-.944-.626-.37-1.446-.59-2.307-.59-.862 0-1.681.22-2.307.59-.405.194-.708.536-.891.944L5.477 14c.02.341.049.682.104 1.022.055.34.133.663.236 1.002l4.486-2.243c-.118-.271-.17-.56-.17-.874 0-.314.052-.617.158-.904l-4.486-2.242c-.106.287-.16.59-.16.904 0 .314.052.617.158.905l4.486 2.242c.096-.34.174-.663.23-.999l-4.486-2.243c.082-.36.209-.703.387-1.022.178-.32.429-.645.736-.944l4.486 2.243z" />
              </svg>
              Continue with Google
            </button>
            {/* Display error message if exists */}
            {fieldErrors.general && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.general}</p>
            )}
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/user-register"
              className="text-blue-500 hover:text-blue-700"
            >
              Don&apos;t have an account? Register
            </Link>
          </div>
        </div>
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
