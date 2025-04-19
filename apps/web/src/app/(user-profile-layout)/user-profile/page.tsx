'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save } from 'lucide-react';
import { notify } from '@/utils/notify-toast';

export default function Profile() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

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

  const handleSaveChanges = async () => {
    console.log('Saving changes:', { name, email });

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/auth/edit-user',
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to save changes: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      console.log('Save successful:', data);

      // Show success toast
      notify('Profile updated successfully!', { type: 'success' });

      // Optionally refetch fresh user info after save
      fetchUserInfo();
    } catch (error: unknown) {
      console.error('Error saving changes:', error);

      if (error instanceof Error) {
        notify(error.message, { type: 'error' });
      } else {
        notify('An unknown error occurred while saving changes.', {
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-500" />
          Account Details
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-lg shadow-sm p-2 bg-gray-100">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                id="firstName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-lg shadow-sm p-2 bg-gray-100">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition-all"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
