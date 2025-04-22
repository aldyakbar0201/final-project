'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notify } from '@/utils/notify-toast'; // Import your custom notify function
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

// Component to wrap useSearchParams
const SearchParamsWrapper = ({
  setSearchParams,
}: {
  setSearchParams: (params: {
    token: string | null;
    error: string | null;
  }) => void;
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    setSearchParams({ token, error });
  }, [searchParams, setSearchParams]);

  return null; // This component doesn't render anything, it just handles side effects
};

export default function Login() {
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<{
    token: string | null;
    error: string | null;
  }>({ token: null, error: null });

  useEffect(() => {
    if (searchParams.error === 'unauthorized') {
      notify('You are not authorized. Please log in.', {
        type: 'error',
        position: 'top-center',
        autoClose: 3000,
      });
    }
  }, [searchParams.error]);

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formLogin),
          credentials: 'include',
        },
      );
      if (response.ok) {
        notify('Login successful', {
          type: 'success',
          position: 'top-center',
          autoClose: 3000,
        });

        setTimeout(() => {
          router.push('/');
        }, 3100); // Wait until toast is visible
        return;
      }
    } catch (error) {
      console.error(error);
      setFieldErrors({ general: 'An error occurred. Please try again.' });
      notify('An unexpected error occurred.', {
        type: 'error',
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setFormLogin({
        email: '',
        password: '',
      });
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="flex min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <div className="flex w-full overflow-hidden rounded-xl">
        <motion.div
          className="w-full md:w-1/2 p-8 my-auto"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2
            className="text-2xl font-bold mb-6 text-gray-800"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Login
          </motion.h2>

          {/* Suspense boundary wrapping the SearchParamsWrapper */}
          <Suspense fallback={<div>Loading...</div>}>
            <SearchParamsWrapper setSearchParams={setSearchParams} />
          </Suspense>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Email Input */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
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
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 mb-3" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 mb-3" aria-hidden="true" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>

            {/* Display error message if exists */}
            {fieldErrors.general && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {fieldErrors.general}
              </motion.p>
            )}
          </form>

          {/* Google SignIn Button */}
          <motion.button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            type="button"
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGoogle className="mr-3" />
            Continue with Google
          </motion.button>

          {/* Links */}
          <div className="mt-4 text-center flex flex-col gap-2 justify-center">
            <Link
              href="/auth/user-register"
              className="text-blue-500 hover:text-blue-700"
            >
              Don&apos;t have an account? Register
            </Link>
            <Link
              href="/auth/request-reset-password"
              className="text-gray-500 hover:text-blue-700"
            >
              Forget Password
            </Link>
          </div>
        </motion.div>

        {/* Background Image with Animation */}
        <motion.div
          className="relative w-1/2 h-full hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          <Image
            src="/fruit-2.jpg"
            alt="Fresh groceries"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
