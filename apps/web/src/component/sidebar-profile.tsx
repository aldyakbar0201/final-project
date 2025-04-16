'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  UserCircle2,
  Plus,
  LogOut,
  MapPin,
  ShoppingBag,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { notify } from '@/utils/notify-toast';
import { ToastContainer } from 'react-toastify';

interface SidebarUserProps {
  onLogout: () => void;
  name: string;
  profilePicture: string | null;
  onProfilePictureChange: (file: File) => void;
}

export default function SidebarUser({
  onLogout,
  name,
  profilePicture,
  onProfilePictureChange,
}: SidebarUserProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onProfilePictureChange(file);
      notify('Profile picture updated!', {
        type: 'success',
        position: 'top-center',
      });
    }
  };

  const handleLogout = () => {
    setLoading(true);
    notify('Logging out...', {
      type: 'info',
      position: 'top-center',
      autoClose: 1500,
    });

    setTimeout(() => {
      notify('Logged out successfully!', {
        type: 'success',
        position: 'top-center',
        autoClose: 1500,
      });

      // Delay the actual logout so user sees the toast first
      setTimeout(() => {
        onLogout();
        setLoading(false);
      }, 1600); // slightly longer than autoClose
    }, 1000);
  };

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-64 bg-gray-100 h-full p-4 shadow-md"
    >
      <ToastContainer />
      <div className="flex flex-col justify-center items-center mb-6">
        <div className="relative w-16 h-16">
          <label htmlFor="profile-picture-upload" className="cursor-pointer">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-400">
                <UserCircle2 className="w-12 h-12" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
              <Plus className="w-4 h-4 text-white" />
            </div>
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
            href="/user-profile/address"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors"
          >
            <MapPin className="w-5 h-5" /> Address
          </Link>
        </li>
        <li>
          <Link
            href="/profile/orders"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" /> Orders
          </Link>
        </li>
        <li>
          <Link
            href="/profile/wishlist"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors"
          >
            <Heart className="w-5 h-5" /> Wishlist
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </li>
      </ul>
    </motion.div>
  );
}
