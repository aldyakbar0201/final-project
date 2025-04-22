'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapPin, MapPinOff, Edit, Plus, Check, Map } from 'lucide-react';
import { motion } from 'framer-motion';

interface Address {
  id: number;
  label: string;
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  postalCode: number;
  isDefault: boolean;
  isPinpointed: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/address`,
        {
          credentials: 'include',
        },
      );
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      if (data?.data) {
        setAddresses(data.data.sort((a: Address, b: Address) => a.id - b.id));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchAddresses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/${id}/default`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      );
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setEditMode(false);
    setOpenModal(true);
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      label: formData.get('label'),
      name: formData.get('name'),
      phoneNumber: formData.get('phoneNumber'),
      street: formData.get('street'),
      city: formData.get('city'),
      postalCode: Number(formData.get('postalCode')),
    };

    try {
      if (editMode && selectedAddress) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/${selectedAddress.id}`,
          {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          },
        );
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      fetchAddresses();
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Map className="w-6 h-6 text-blue-500" />
        My Address
      </h2>
      <div className="flex items-center justify-between mb-8">
        <input
          type="text"
          placeholder="Search address..."
          className="w-full max-w-2xs px-4 py-2 border rounded-xl shadow-sm"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="ml-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md cursor-pointer"
        >
          <Plus size={18} /> Add New Address
        </motion.button>
      </div>

      <div className="flex flex-col gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-xl p-4 ${
                address.isDefault ? 'bg-blue-50 border-blue-500' : 'bg-white'
              }`}
            >
              <div className="flex mb-2 items-center">
                <div className="font-bold">{address.label}</div>
                {address.isDefault && (
                  <div className="flex items-center text-gray-500 bg-gray-100 py-1 px-2 rounded-md text-xs">
                    Default Address <Check size={14} className="ml-1" />
                  </div>
                )}
              </div>

              <div className="text-gray-800 font-semibold">{address.name}</div>
              <div className="text-gray-600">{address.phoneNumber}</div>
              <div className="text-gray-600">
                {address.street}, {address.city} {address.postalCode}
              </div>

              <div className="flex items-center mt-2 text-sm gap-2">
                {address.isPinpointed ? (
                  <>
                    <MapPin size={16} className="text-blue-600" />{' '}
                    <span className="text-blue-600">Pinpoint Has Set</span>
                  </>
                ) : (
                  <>
                    <MapPinOff size={16} className="text-gray-400" />{' '}
                    <span className="text-gray-400">Pinpoint Has Not Set</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center mt-4 gap-2 text-sm">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(address)}
                  className="text-blue-600 flex items-center gap-1 cursor-pointer"
                >
                  <Edit size={16} /> Edit Address
                </motion.button>
                {!address.isDefault && (
                  <>
                    <span className="text-gray-300">|</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSetDefault(address.id)}
                      className="text-blue-600 cursor-pointer"
                    >
                      Set As Default Address
                    </motion.button>
                  </>
                )}
                <span className="text-gray-300">|</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(address.id)}
                  className="text-red-500 cursor-pointer"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500">There Is No Address.</div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="name"
                defaultValue={selectedAddress?.name}
                required
                placeholder="Name"
                className="border p-2 rounded-md"
              />
              <input
                name="phoneNumber"
                defaultValue={selectedAddress?.phoneNumber}
                required
                placeholder="Phone Number"
                className="border p-2 rounded-md"
              />
              <input
                name="street"
                defaultValue={selectedAddress?.street}
                required
                placeholder="Alamat Lengkap"
                className="border p-2 rounded-md"
              />
              <input
                name="city"
                defaultValue={selectedAddress?.city}
                required
                placeholder="Kota"
                className="border p-2 rounded-md"
              />
              <input
                name="postalCode"
                defaultValue={selectedAddress?.postalCode}
                required
                placeholder="Kode Pos"
                type="number"
                className="border p-2 rounded-md"
              />
              <div className="flex gap-2 justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border rounded-md cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
                >
                  Save
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
