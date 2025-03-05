'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Inventory', path: '/admin/inventory' },
  { name: 'Discounts', path: '/admin/discounts' },
  { name: 'Reports', path: '/admin/reports' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
      <ul>
        {adminNavItems.map((item) => (
          <li
            key={item.path}
            className={`p-2 ${pathname === item.path ? 'bg-gray-700' : ''}`}
          >
            <Link href={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
