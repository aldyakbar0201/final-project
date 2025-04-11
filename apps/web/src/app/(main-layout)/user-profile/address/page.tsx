'use client';
import SidebarUser from '@/component/sidebar-profile';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Edit, Plus } from 'lucide-react';

export default function AddressPage() {
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

  const handleProfilePictureChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="flex flex-col min-h-screen mt-10 px-16">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        My Account
      </h2>

      <div className="flex flex-row gap-10">
        <SidebarUser
          onLogout={handleLogout}
          name={name}
          profilePicture={profilePicture}
          onProfilePictureChange={handleProfilePictureChange}
        />

        <div className="bg-white p-8 rounded-lg shadow-md w-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Address</h3>
            <button className="flex items-center text-blue-500 hover:text-blue-700">
              <Plus className="w-5 h-5 mr-1" />
              Add address
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="bg-white p-8 rounded-lg border border-gray-300 w-full flex flex-col">
              <div className="flex justify-between items-center mb=2">
                <h4 className="text-lg font-medium text-gray=800"> Name</h4>
                {/* Logout button can be added here with LogOut icon */}
                {/* Example:
                  onClick={handleLogout} 
                  */}
                {/* Uncomment below line to add logout functionality */}
                {/*<LogOut />*/}
                {/* Edit button with icon */}
                <button
                  className={
                    'flex items-center text-blue-500 hover:text-blue-700'
                  }
                >
                  <Edit className={'w-5 h-5 mr-1'} /> Edit address
                </button>
              </div>
              {/* Address details */}
              <span className={'text-gray­600'}>Address</span>
              <p className={'text-gray­800'}>Jl. Taman Malaka Utara...</p>
              {/* Set as default address button */}

              <button
                className={'flex items center text blue500 hover:text blue700'}
              >
                Set as default address{' '}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
