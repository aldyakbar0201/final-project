// SidebarUser.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarUserProps {
  onLogout: () => void;
  name: string;
  profilePicture: string;
}

export default function SidebarUser({
  onLogout,
  name,
  profilePicture,
}: SidebarUserProps) {
  return (
    <div className="w-64 bg-gray-100 h-full p-4 shadow-md">
      <div className="flex flex-col justify-center items-center mb-6">
        <div className="relative w-16 h-16">
          <Image
            src={profilePicture}
            alt="Profile"
            width={50}
            height={50}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold ml-4">{name}</h2>
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
