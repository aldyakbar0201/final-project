'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ConfirmResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(() => resolve(''), 2000));

      // On success
      setSuccessMessage('Your password has been reset successfully!');
    } catch (error) {
      console.error(error);
      // On failure
      setErrorMessage('Failed to reset password.');
    } finally {
      // Stop loading state regardless of outcome
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          Reset Your Password
        </h2>

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleConfirmResetPassword}>
          {/* New Password Field */}
          <div className="mb-5">
            <label
              htmlFor="newPassword"
              className="block text-gray-dark font-semibold mb-[0.15rem]"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`shadow-sm appearance-none border ${newPassword ? 'border-blue' : 'border-gray'} rounded w-full py-[0.75rem] px-[1rem] leading-tight focus:outline-none focus:ring focus:ring-blue`}
              placeholder="Enter your new password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-[1.5rem]">
            <label
              htmlFor="confirm-password"
              className="block text-gray-dark font-semibold mb-[0.15rem]"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your new password"
              className={`shadow-sm appearance-none border ${confirmPassword ? 'border-blue' : 'border-gray'} rounded w-full py-[0.75rem] px-[1rem]
                            leading-tight focus:outline-none focus:ring focus:ring-blue`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-${loading ? '300' : '500'} hover:bg-blue-${loading ? '300' : '600'} transition duration=200 ease-in-out transform hover:scale[1.05]
                                active:scale[0.95]} text-white font-bold py-[0.75rem]
                                rounded`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            href="/user-profile"
            className="text-blue-500 hover:text-blue-700"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
