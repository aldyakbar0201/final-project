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
  Loader2,
  User,
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
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(
        'http://localhost:8000/api/v1/upload-photo',
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const newProfilePicture = data.user?.photo;

      if (newProfilePicture) {
        onProfilePictureChange(file);
        notify('Profile picture updated!', {
          type: 'success',
          position: 'top-center',
        });
      } else {
        throw new Error('No profile picture URL returned.');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      notify('Failed to upload profile picture.', {
        type: 'error',
        position: 'top-center',
      });
    } finally {
      setUploading(false);
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

      setTimeout(() => {
        onLogout();
        setLoading(false);
      }, 1600);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-64 bg-gray-50 h-full p-6 shadow-lg rounded-r-xl"
    >
      <ToastContainer />
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-20 h-20">
          <label htmlFor="profile-picture-upload" className="cursor-pointer">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 text-gray-400 border-2 border-dashed border-gray-300">
                <UserCircle2 className="w-14 h-14" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white">
              {uploading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
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
        <h2 className="text-xl font-bold mt-3 text-gray-800">{name}</h2>
      </div>

      <h3 className="text-md font-semibold text-gray-600 mb-4 uppercase tracking-wide">
        Account
      </h3>

      <ul className="flex flex-col gap-3">
        {/* New Personal Profile */}
        <motion.li
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg"
        >
          <Link
            href="/user-profile"
            className="flex items-center gap-3 p-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <User className="w-5 h-5" />
            Personal Profile
          </Link>
        </motion.li>

        <motion.li
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg"
        >
          <Link
            href="/user-profile/address"
            className="flex items-center gap-3 p-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Address
          </Link>
        </motion.li>

        <motion.li
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg"
        >
          <Link
            href="/profile/orders"
            className="flex items-center gap-3 p-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Link>
        </motion.li>

        <motion.li
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg"
        >
          <Link
            href="/profile/wishlist"
            className="flex items-center gap-3 p-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Heart className="w-5 h-5" />
            Wishlist
          </Link>
        </motion.li>

        <motion.li
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg"
        >
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-3 p-2 w-full text-left text-gray-700 hover:bg-red-100 hover:text-red-500 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </motion.li>
      </ul>
    </motion.div>
  );
}
