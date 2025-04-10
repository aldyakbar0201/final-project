// src/app/(main-layout)/user-profile/page.tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarUser from '@/component/sidebar-profile';
import Link from 'next/link';

export default function Profile() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch user info: ${response.status} - ${errorText}`,
        );
      }
      const data = await response.json();
      if (data && typeof data === 'object') {
        setName(data.name || '');
        setEmail(data.email);
        setProfilePicture(data.profilePicture || null);
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
    // For now, just log the changes
  };

  const handleProfilePictureChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-screen mt-10 px-16">
      <h2 className="text-3xl font-bold mb-4 text-center">My Account</h2>
      <div className="flex flex-row">
        <SidebarUser
          onLogout={handleLogout}
          name={name}
          profilePicture={profilePicture}
          onProfilePictureChange={handleProfilePictureChange}
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
            <div className="flex flex-row gap-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
              <Link href="/user-profile/reset-password">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Reset Password
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
