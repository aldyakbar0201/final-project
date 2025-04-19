'use client';

import { useRouter } from 'next/navigation';
import { createUser } from '../../../../../lib/users';
import UserForm from '../../../../../component/useForm';
import { UserFormData } from '../../../../../shared/types';

export default function CreateUserPage() {
  const router = useRouter();

  const handleCreate = async (data: UserFormData) => {
    if (!data.password) {
      alert('Password is required');
      return;
    }

    await createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    router.push('/admin/users');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-green-600">
            Freshbasket
          </h1>
          <span className="text-sm text-gray-500">Super Admin</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl border border-gray-200 transition-all">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
            Create New User
          </h2>
          <UserForm onSubmit={handleCreate} submitText="Create User" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-600">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              About Us
            </h3>
            <p>
              Online Grocery is your one-stop shop for fresh produce and
              everyday essentials.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-green-600 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Contact Us
            </h3>
            <p>
              Email:{' '}
              <a
                href="mailto:support@onlinegrocery.com"
                className="hover:text-green-600 transition"
              >
                support@onlinegrocery.com
              </a>
            </p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8">
          © {new Date().getFullYear()} Online Grocery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
