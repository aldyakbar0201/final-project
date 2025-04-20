// register page
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notify } from '@/utils/notify-toast';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { FaGoogle } from 'react-icons/fa';

export default function Register() {
  const [formRegister, setFormRegister] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  async function handleSubmit() {
    setFieldErrors({});
    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formRegister),
        },
      );
      if (!response.ok) {
        return notify('Error!');
      }
      notify('Registration successful!');
      router.push('/auth/user-login');
    } catch (error) {
      console.error(error);
      setFieldErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setFormRegister({
        name: '',
        email: '',
        password: '',
      });
      setLoading(false);
    }
  }

  return (
    <motion.section
      className="flex min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-xl">
        <ToastContainer />
        {/* Background Image */}
        <motion.div
          className="relative w-1/2 h-full hidden md:block"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        >
          <Image
            src="/fruit-1.jpg"
            alt="Fresh groceries"
            fill
            className="object-cover"
          />
        </motion.div>
        {/* Form Container */}
        <motion.div
          className="w-full md:w-1/2 p-8 my-auto"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Your Name
              </label>
              <motion.input
                type="text"
                id="name"
                value={formRegister.name}
                onChange={(e) =>
                  setFormRegister((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your name"
                required
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                value={formRegister.email}
                onChange={(e) =>
                  setFormRegister((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
                required
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <motion.input
                type="password"
                id="password"
                value={formRegister.password}
                onChange={(e) =>
                  setFormRegister((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
                required
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <motion.button
              type="submit"
              className={`${
                loading
                  ? 'border-gray-500 text-gray-500'
                  : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4'
              } border  mt-2 mb-4`}
              disabled={loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? 'Loading...' : 'Register'}
            </motion.button>
            <div className="flex items-center justify-center mb-4">
              <div className="border-t border-gray-300 w-full mr-4"></div>
              <span className="text-gray-500">OR</span>
              <div className="border-t border-gray-300 w-full ml-4"></div>
            </div>

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
          <form action="/auth/google-login">
            <motion.button
              type="submit"
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGoogle className="mr-3" />
              Continue with Google
            </motion.button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/auth/user-login"
              className="text-blue-500 hover:text-blue-700"
            >
              Already have an account? Login
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
