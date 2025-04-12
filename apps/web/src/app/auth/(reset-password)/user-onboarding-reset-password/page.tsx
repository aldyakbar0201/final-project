import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default async function OnboardingResetPassword({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const response = await fetch(
    `http://localhost:8000/api/v1/reset-password/confirm-reset-password?token=${searchParams.token}`,
  );

  if (!response.ok) {
    return (
      <section className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center">
        <div className="animate-fade-in mb-5">
          <AlertCircle size={48} color="#ff5733" />
        </div>
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
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center">
      <div className="animate-fade-in mb-5">
        <CheckCircle size={48} color="#33ff57" />
      </div>
      <p className="text-xl mb-5 text-gray-800 font-semibold">
        Great news! Your password reset was successful.
      </p>
      <p className="mb-5 text-gray600">
        You can now set up your new password to secure your account.
      </p>
      {/* Optional additional instruction */}
      {/*<span>Make sure to choose a strong password!</span>*/}

      <Link
        href="/auth/confirm-reset-password"
        className="text-blue500 hover:text-blue700 transition duration=300"
      >
        Proceed to Set Your New Password
      </Link>
    </section>
  );
}
