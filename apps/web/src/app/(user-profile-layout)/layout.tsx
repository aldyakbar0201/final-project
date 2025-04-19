'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/navbar';
import Footer from '@/component/footer';
import SidebarUser from '@/component/sidebar-profile';

export default function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [name, setName] = useState<string>('');
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
        setProfilePicture(data.photo || null);
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
      router.push('/'); // Redirect to home
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfilePictureChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen mt-10 px-16">
        <div className="flex flex-row mt-2">
          <SidebarUser
            name={name}
            profilePicture={profilePicture}
            onLogout={handleLogout}
            onProfilePictureChange={handleProfilePictureChange}
          />
          <div className="flex-1 px-6 bg-white">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
