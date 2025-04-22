import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';
// import { motion } from 'framer-motion';

export default async function Onboarding({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;
  console.log(token);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/confirm-email?token=${token}`,
  );

  if (!response.ok) {
    return (
      <section
        className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center"
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 0.5 }}
      >
        <div
          className="mb-5"
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // transition={{ duration: 0.3 }}
        >
          <AlertCircle size={48} color="#ff5733" />
        </div>
        <p
          className="text-xl mb-5 text-gray-800"
          // initial={{ y: 20, opacity: 0 }}
          // animate={{ y: 0, opacity: 1 }}
          // transition={{ duration: 0.4 }}
        >
          Oops! It seems that the confirmation link is invalid or has expired.
          Please try registering again.
        </p>
        <Link
          href="/auth/user-register"
          className="text-blue-500 hover:text-blue-700 transition duration-300"
        >
          Go to Registration Page
        </Link>
      </section>
    );
  }

  return (
    <section
      className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ duration: 0.5 }}
    >
      <div
        className="mb-5"
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 0.3 }}
      >
        <CheckCircle size={48} color="#33ff57" />
      </div>
      <p
        className="text-xl mb-5 text-gray-800"
        // initial={{ y: 20, opacity: 0 }}
        // animate={{ y: 0, opacity: 1 }}
        // transition={{ duration: 0.4 }}
      >
        Welcome aboard! Your email has been successfully confirmed. We&apos;re
        excited to have you with us!
      </p>
      <Link
        href="/auth/user-login"
        className="text-blue-500 hover:text-blue-700 transition duration-300"
      >
        Proceed to Login Page
      </Link>
    </section>
  );
}
