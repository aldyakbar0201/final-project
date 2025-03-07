'use client';
import { useState } from 'react';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('/default-profile.jpg');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Simpan perubahan data (dalam aplikasi nyata, Anda akan mengirim data ke server)
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName('John Doe');
    setEmail('john.doe@example.com');
    setPassword('');
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative w-24 h-24">
            <Image
              src={profilePicture}
              alt="Profile"
              fill
              className="w-24 h-24 rounded-full object-cover"
            />
            {isEditing && (
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isEditing ? '' : 'bg-gray-100'
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isEditing ? '' : 'bg-gray-100'
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isEditing ? '' : 'bg-gray-100'
              }`}
              readOnly={!isEditing}
            />
          </div>
        </form>
        {!isEditing && (
          <div className="mt-4 flex flex-row justify-center text-center gap-7">
            <Link href="/" className="text-blue-500 hover:text-blue-700">
              Logout
            </Link>
            <Link
              href="/profile/reset-password"
              className="text-blue-500 hover:text-blue-700"
            >
              Reset Password
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
