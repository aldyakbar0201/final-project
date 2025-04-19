'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notify } from '@/utils/notify-toast'; // Import your custom notify function
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const router = useRouter();

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formLogin),
        credentials: 'include',
      });
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
      <div className="flex w-full overflow-hidden rounded-xl">
        <ToastContainer />
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
          <form action="/auth/google-login">
            <motion.button
              type="submit"
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.643 9c-.111-.004-.222-.004-.333-.004-4.216 0-7.765 2.67-9.64 6.499.359.078.719.118 1.079.118.573 0 1.136-.102 1.643-.294-.209-.677-.823-1.212-1.504-1.212-.938 0-1.694.492-2.093 1.136l-.008.04c-.266.96-.83 1.725-1.566 2.165h-.004c-.77.443-1.694.638-2.697.638-2.091 0-3.865-1.388-4.39-3.182C.689 9.099 1.322 7.862 2.167 7.088c.745-.773 1.866-1.297 3.042-1.297 1.02 0 1.936.427 2.538 1.118.603-.691 1.524-1.118 2.538-1.118 2.209 0 4.129 1.434 4.927 3.227zm-8.254 4.002c-.183-.409-.486-.75-.891-.944-.626-.37-1.446-.59-2.307-.59-.862 0-1.681.22-2.307.59-.405.194-.708.536-.891.944L5.477 14c.02.341.049.682.104 1.022.055.34.133.663.236 1.002l4.486-2.243c-.118-.271-.17-.56-.17-.874 0-.314.052-.617.158-.904l-4.486-2.242c-.106.287-.16.59-.16.904 0 .314.052.617.158.905l4.486 2.242c.096-.34.174-.663.23-.999l-4.486-2.243c.082-.36.209-.703.387-1.022.178-.32.429-.645.736-.944l4.486 2.243z" />
              </svg>
              Continue with Google
            </motion.button>
          </form>

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
