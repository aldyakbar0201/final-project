import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default async function Onboarding({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const response = await fetch(
    `http://localhost:8000/api/v1/auth/confirm-email?token=${searchParams.token}`,
  );

  if (!response.ok) {
    return (
      <section className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center">
        <div className="animate-fade-in mb-5">
          <AlertCircle size={48} color="#ff5733" />
        </div>
        <p className="text-xl mb-5 text-gray-800">
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
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center">
      <div className="animate-fade-in mb-5">
        <CheckCircle size={48} color="#33ff57" />
      </div>
      <p className="text-xl mb-5 text-gray-800">
        Welcome aboard! Your email has been successfully confirmed. We&apos;re
        excited to have you with us!
      </p>
      <Link
        href="/auth/user-login"
        className="text-blue-500 hover:text-blue-700 transition duration=300"
      >
        Proceed to Login Page
      </Link>
    </section>
  );
}
