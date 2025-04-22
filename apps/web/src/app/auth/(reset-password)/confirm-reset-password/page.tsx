'use client';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { notify } from '@/utils/notify-toast';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

function ConfirmResetPasswordContent() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); // Move useSearchParams here
  const token = searchParams.get('token'); // Get token directly here

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      notify('Passwords do not match.', {
        type: 'error',
        position: 'top-center',
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    try {
      if (!token) throw new Error('Invalid or missing token.');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reset-password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password: newPassword }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password.');
      }

      notify('Your password has been reset successfully!', {
        type: 'success',
        position: 'top-center',
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push('/auth/user-login');
      }, 3100);
    } catch (error) {
      console.error(error);
      notify('Failed to reset password.', {
        type: 'error',
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
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
            Reset Password
          </motion.h2>

          <form onSubmit={handleConfirmResetPassword}>
            {/* New Password */}
            <div className="mb-6">
              <label
                htmlFor="new-password"
                className="block text-gray-700 font-bold mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 font-bold mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Re-enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Submit */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4 transition duration-300 ease-in-out ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </motion.button>
          </form>
          <div className="mt-6 text-center flex flex-col gap-2 justify-center">
            <Link
              href="/auth/user-login"
              className="text-blue-500 hover:text-blue-700"
            >
              Back to Login Page?
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="relative w-1/2 h-full"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
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

export default function ConfirmResetPassword() {
  return (
    <Suspense>
      <ConfirmResetPasswordContent />
    </Suspense>
  );
}
