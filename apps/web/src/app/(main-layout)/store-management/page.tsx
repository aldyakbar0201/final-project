// components/store-management.tsx
'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUserPlus,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Store {
  id: number;
  name: string;
  location: string;
  admin: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
}

export default function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([
    { id: 1, name: 'Toko A', location: 'Jl. A', admin: 'Admin A' },
    { id: 2, name: 'Toko B', location: 'Jl. B', admin: 'Admin B' },
  ]);

  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, name: 'Admin A', email: 'adminA@example.com' },
    { id: 2, name: 'Admin B', email: 'adminB@example.com' },
  ]);

  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreLocation, setNewStoreLocation] = useState('');
  const [newStoreAdmin, setNewStoreAdmin] = useState('');

  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [editingStoreName, setEditingStoreName] = useState('');
  const [editingStoreLocation, setEditingStoreLocation] = useState('');
  const [editingStoreAdmin, setEditingStoreAdmin] = useState('');

  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const addStore = () => {
    if (newStoreName && newStoreLocation && newStoreAdmin) {
      const newStore: Store = {
        id: stores.length + 1,
        name: newStoreName,
        location: newStoreLocation,
        admin: newStoreAdmin,
      };
      setStores([...stores, newStore]);
      setNewStoreName('');
      setNewStoreLocation('');
      setNewStoreAdmin('');
    }
  };

  const deleteStore = (id: number) => {
    setStores(stores.filter((store) => store.id !== id));
  };

  const startEditStore = (store: Store) => {
    setEditingStoreId(store.id);
    setEditingStoreName(store.name);
    setEditingStoreLocation(store.location);
    setEditingStoreAdmin(store.admin);
  };

  const updateStore = () => {
    if (editingStoreId !== null) {
      const updatedStores = stores.map((store) =>
        store.id === editingStoreId
          ? {
              id: store.id,
              name: editingStoreName,
              location: editingStoreLocation,
              admin: editingStoreAdmin,
            }
          : store,
      );
      setStores(updatedStores);
      setEditingStoreId(null);
      setEditingStoreName('');
      setEditingStoreLocation('');
      setEditingStoreAdmin('');
    }
  };

  const addAdmin = () => {
    if (newAdminName && newAdminEmail) {
      const newAdmin: Admin = {
        id: admins.length + 1,
        name: newAdminName,
        email: newAdminEmail,
      };
      setAdmins([...admins, newAdmin]);
      setNewAdminName('');
      setNewAdminEmail('');
    }
  };

  return (
    <div className="min-h-screen mt-8 ">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Store Management
        </motion.h1>

        {/* Store Management Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Manage Stores</h2>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                placeholder="Store Name"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newStoreLocation}
                onChange={(e) => setNewStoreLocation(e.target.value)}
                placeholder="Location"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newStoreAdmin}
                onChange={(e) => setNewStoreAdmin(e.target.value)}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Admin</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.name}>
                    {admin.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addStore}
                className="bg-blue-500 text-white p-2 rounded flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Store
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Admin</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) =>
                editingStoreId === store.id ? (
                  <tr key={store.id}>
                    <td className="border p-2">{store.id}</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={editingStoreName}
                        onChange={(e) => setEditingStoreName(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={editingStoreLocation}
                        onChange={(e) =>
                          setEditingStoreLocation(e.target.value)
                        }
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        value={editingStoreAdmin}
                        onChange={(e) => setEditingStoreAdmin(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Admin</option>
                        {admins.map((admin) => (
                          <option key={admin.id} value={admin.name}>
                            {admin.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={updateStore}
                        className="bg-green-500 text-white p-2 rounded mr-2 flex items-center"
                      >
                        <FaSave className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingStoreId(null)}
                        className="bg-red-500 text-white p-2 rounded flex items-center"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={store.id}>
                    <td className="border p-2">{store.id}</td>
                    <td className="border p-2">{store.name}</td>
                    <td className="border p-2">{store.location}</td>
                    <td className="border p-2">{store.admin}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => startEditStore(store)}
                        className="bg-blue-500 text-white p-2 rounded mr-2 flex items-center"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStore(store.id)}
                        className="bg-red-500 text-white p-2 rounded flex items-center"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Assign Store Admin Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Assign Store Admin</h2>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Admin Name"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Admin Email"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addAdmin}
                className="bg-blue-500 text-white p-2 rounded flex items-center"
              >
                <FaUserPlus className="mr-2" />
                Add Admin
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="border p-2">{admin.id}</td>
                  <td className="border p-2">{admin.name}</td>
                  <td className="border p-2">{admin.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
