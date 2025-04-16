'use client';
import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OnboardingResetPassword({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>(
    'loading',
  );

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/reset-password/confirm-reset-password?token=${searchParams.token}`,
        );
        setStatus(response.ok ? 'success' : 'error');
      } catch {
        setStatus('error');
      }
    };
    verifyToken();
  }, [searchParams.token]);

  if (status === 'loading') {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center"
      >
        <p className="text-lg text-gray-600">Verifying...</p>
      </motion.section>
    );
  }

  if (status === 'error') {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <AlertCircle size={48} color="#ff5733" />
        </motion.div>
        <p className="text-xl mb-5 text-gray-800 font-semibold">
          Oops! It seems we couldn&apos;t verify your request.
        </p>
        <p className="mb-5 text-gray-600">
          Please check your email for a confirmation link or request a new one.
        </p>
        <Link
          href="/auth/request-reset-password"
          className="text-blue-500 hover:text-blue-700 transition duration-300"
        >
          Request a New Reset Link
        </Link>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-5"
      >
        <CheckCircle size={48} color="#33ff57" />
      </motion.div>
      <p className="text-xl mb-5 text-gray-800 font-semibold">
        Great news! Your password reset was successful.
      </p>
      <p className="mb-5 text-gray-600">
        You can now set up your new password to secure your account.
      </p>
      <Link
        href={`/auth/confirm-reset-password?token=${searchParams.token}`}
        className="text-blue-500 hover:text-blue-700 transition duration-300"
      >
        Proceed to Set Your New Password
      </Link>
    </motion.section>
  );
}
