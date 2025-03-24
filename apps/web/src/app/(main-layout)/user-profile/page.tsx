// Profile.tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarUser from '@/component/sidebar-profile';

export default function Profile() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState('/default-profile.jpg');
  const router = useRouter();
  console.log(setProfilePicture);

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      if (data && typeof data === 'object') {
        setName(data.name || '');
        setEmail(data.email);
      } else {
        console.error('Unexpected data structure:', data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      router.push('/'); // Redirect to home page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSaveChanges = async () => {
    // Implement save changes logic here
    console.log('Saving changes:', { name, email });
  };

  return (
    <div className="flex flex-col min-h-screen mt-10 px-16">
      <h2 className="text-3xl font-bold mb-4 text-center">My Account</h2>
      <div className="flex flex-row">
        <SidebarUser
          onLogout={handleLogout}
          name={name}
          profilePicture={profilePicture}
        />
        <div className="flex-1 px-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveChanges();
            }}
          >
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <h3 className="text-lg font-semibold mt-6">Password</h3>
            <div className="mb-4">
              <label htmlFor="oldPassword" className="block text-gray-700">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="repeatNewPassword"
                className="block text-gray-700"
              >
                Repeat New Password
              </label>
              <input
                type="password"
                id="repeatNewPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
