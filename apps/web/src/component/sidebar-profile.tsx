// SidebarUser.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { UserCircle2, Plus } from 'lucide-react'; // Import the UserCircle2 and Plus icons from Lucide React

interface SidebarUserProps {
  onLogout: () => void;
  name: string;
  profilePicture: string | null;
  onProfilePictureChange: (file: File) => void; // Add a prop for handling profile picture change
}

export default function SidebarUser({
  onLogout,
  name,
  profilePicture,
  onProfilePictureChange,
}: SidebarUserProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onProfilePictureChange(file);
    }
  };

  return (
    <div className="w-64 bg-gray-100 h-full p-4 shadow-md">
      <div className="flex flex-col justify-center items-center mb-6">
        <div className="relative w-16 h-16">
          <label htmlFor="profile-picture-upload" className="cursor-pointer">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt="Profile"
                width={50}
                height={50}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-400">
                <UserCircle2 className="w-12 h-12" />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </label>
          <input
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <h2 className="text-xl font-bold mt-2">{name}</h2>
      </div>
      <h3 className="text-lg font-semibold mb-4">Account</h3>
      <ul className="space-y-2">
        <li>
          <Link
            href="/profile/address"
            className="text-gray-700 hover:text-blue-500"
          >
            Address
          </Link>
        </li>
        <li>
          <Link
            href="/profile/orders"
            className="text-gray-700 hover:text-blue-500"
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            href="/profile/wishlist"
            className="text-gray-700 hover:text-blue-500"
          >
            Wishlist
          </Link>
        </li>
        <li>
          <button
            onClick={onLogout}
            className="text-gray-700 hover:text-red-500 w-full text-left"
          >
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
}
