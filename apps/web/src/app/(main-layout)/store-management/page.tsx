'use client';

import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUserPlus,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { notify } from '@/utils/notify-toast';

interface Store {
  id: number;
  name: string;
  address: string;
  userId: number;
}

interface Admin {
  id: number;
  name: string;
  email: string;
}

export default function StoreManagement() {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStoreLatitude, setNewStoreLatitude] = useState('');
  const [newStoreLongitude, setNewStoreLongitude] = useState('');
  const [newStoreMaxDistance, setNewStoreMaxDistance] = useState('');
  const [newStoreAdminId, setNewStoreAdminId] = useState('');

  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [editingStoreName, setEditingStoreName] = useState('');
  const [editingStoreLocation, setEditingStoreLocation] = useState('');

  const [assignStoreId, setAssignStoreId] = useState('');
  const [assignUserId, setAssignUserId] = useState('');

  useEffect(() => {
    fetchStores();
    fetchAdmins();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch(
        'http://localhost:8000/api/v1/super-admin/stores',
        {
          credentials: 'include',
        },
      );
      const data = await res.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/users', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch admins');
      }

      const users = await res.json();
      if (!Array.isArray(users)) {
        throw new Error('Invalid users format');
      }

      const storeAdmins = users.filter((user) => user.role === 'STORE_ADMIN');
      setAdmins(storeAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setAdmins([]);
    }
  };

  const createStore = async () => {
    if (
      !newStoreName ||
      !newStoreAddress ||
      !newStoreLatitude ||
      !newStoreLongitude ||
      !newStoreMaxDistance ||
      !newStoreAdminId
    )
      return;

    try {
      const res = await fetch(
        'http://localhost:8000/api/v1/super-admin/stores',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newStoreName,
            address: newStoreAddress,
            latitude: parseFloat(newStoreLatitude),
            longitude: parseFloat(newStoreLongitude),
            maxDistance: parseFloat(newStoreMaxDistance),
            userId: parseInt(newStoreAdminId),
          }),
        },
      );

      if (res.ok) {
        notify('Store created successfully!', {
          type: 'success',
          position: 'top-center',
        });
        fetchStores();
        setNewStoreName('');
        setNewStoreAddress('');
        setNewStoreLatitude('');
        setNewStoreLongitude('');
        setNewStoreMaxDistance('');
        setNewStoreAdminId('');
      } else {
        const errorData = await res.json();
        notify(errorData.message || 'Failed to create store', {
          type: 'error',
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error(error);
      notify('Error creating store', { type: 'error', position: 'top-center' });
    }
  };

  const updateStore = async () => {
    if (editingStoreId === null) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/super-admin/stores/${editingStoreId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingStoreName,
            location: editingStoreLocation,
          }),
        },
      );

      if (res.ok) {
        notify('Store updated successfully!', {
          type: 'success',
          position: 'top-center',
        });
        fetchStores();
        setEditingStoreId(null);
        setEditingStoreName('');
        setEditingStoreLocation('');
      } else {
        const errorData = await res.json();
        notify(errorData.message || 'Failed to update store', {
          type: 'error',
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error(error);
      notify('Error updating store', { type: 'error', position: 'top-center' });
    }
  };

  const deleteStore = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/super-admin/stores/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (res.ok) {
        notify('Store deleted successfully!', {
          type: 'success',
          position: 'top-center',
        });
        fetchStores();
      } else {
        const errorData = await res.json();
        notify(errorData.message || 'Failed to delete store', {
          type: 'error',
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error(error);
      notify('Error deleting store', { type: 'error', position: 'top-center' });
    }
  };

  const assignAdmin = async () => {
    if (!assignStoreId || !assignUserId) return;

    try {
      const res = await fetch(
        'http://localhost:8000/api/v1/super-admin/assign-store-admin',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId: parseInt(assignStoreId),
            userId: parseInt(assignUserId),
          }),
        },
      );

      if (res.ok) {
        notify('Admin assigned successfully!', {
          type: 'success',
          position: 'top-center',
        });
        await fetchAdmins(); // Re-fetch admins
        await fetchStores(); // 🆕 Re-fetch stores immediately!
        setAssignStoreId('');
        setAssignUserId('');
      } else {
        const errorData = await res.json();
        notify(errorData.message || 'Failed to assign admin', {
          type: 'error',
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error(error);
      notify('Error assigning admin', {
        type: 'error',
        position: 'top-center',
      });
    }
  };

  const onLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        window.location.href = '/';
      } else {
        notify('Logout failed', { type: 'error', position: 'top-center' });
      }
    } catch (error) {
      console.error(error);
      notify('Logout error', { type: 'error', position: 'top-center' });
    }
  };

  const handleLogout = () => {
    setLoading(true);
    notify('Logging out...', { type: 'info', position: 'top-center' });
    setTimeout(() => {
      notify('Logged out successfully!', {
        type: 'success',
        position: 'top-center',
      });
      setTimeout(() => {
        onLogout();
        setLoading(false);
      }, 1600);
    }, 1000);
  };

  return (
    <div className="min-h-screen mt-8 px-2 sm:px-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Store Management
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </motion.button>
        </div>

        {/* Manage Stores */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Manage Stores</h2>

          {/* Create Store Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Store Name"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Address"
              value={newStoreAddress}
              onChange={(e) => setNewStoreAddress(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Latitude"
              value={newStoreLatitude}
              onChange={(e) => setNewStoreLatitude(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={newStoreLongitude}
              onChange={(e) => setNewStoreLongitude(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Max Distance (KM)"
              value={newStoreMaxDistance}
              onChange={(e) => setNewStoreMaxDistance(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <select
              value={newStoreAdminId}
              onChange={(e) => setNewStoreAdminId(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Admin</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
            </select>
            <button
              onClick={createStore}
              className="bg-blue-500 text-white p-2 rounded flex items-center justify-center cursor-pointer"
            >
              <FaPlus className="mr-2" /> Add Store
            </button>
          </div>

          {/* Store List */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
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
                          className="border p-2 rounded w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            editingStoreId === store.id
                              ? editingStoreLocation
                              : (store.address ?? '')
                          }
                          onChange={(e) =>
                            setEditingStoreLocation(e.target.value)
                          }
                          className="border p-2 rounded w-full"
                        />
                      </td>
                      <td className="border p-2">{store.userId}</td>
                      <td className="border p-2 flex space-x-2">
                        <button
                          onClick={updateStore}
                          className="bg-green-500 text-white p-2 rounded flex items-center"
                        >
                          <FaSave className="mr-2" /> Save
                        </button>
                        <button
                          onClick={() => setEditingStoreId(null)}
                          className="bg-red-500 text-white p-2 rounded flex items-center"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={store.id}>
                      <td className="border p-2">{store.id}</td>
                      <td className="border p-2">{store.name}</td>
                      <td className="border p-2">{store.address}</td>
                      <td className="border p-2">{store.userId}</td>
                      <td className="border p-2 flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingStoreId(store.id);
                            setEditingStoreName(store.name);
                            setEditingStoreLocation(store.address);
                          }}
                          className="bg-blue-500 text-white p-2 rounded flex items-center cursor-pointer"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => deleteStore(store.id)}
                          className="bg-red-500 text-white p-2 rounded flex items-center cursor-pointer"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Assign Store Admin Section */}
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Assign Store Admin
          </h2>
          <div className="mb-4 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={assignStoreId}
                onChange={(e) => setAssignStoreId(e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Store</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
              <select
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Admin</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={assignAdmin}
              className="bg-blue-500 text-white p-2 rounded flex items-center cursor-pointer"
            >
              <FaUserPlus className="mr-2" /> Assign Admin
            </button>
          </div>

          {/* Admin List */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
