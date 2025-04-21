'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../../lib/users';
import AdminNav from '../../../component/admin-navbar';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (
      !session ||
      (session.role !== 'super-admin' && session.role !== 'store-admin')
    ) {
      router.push('/admin-dashboard');
    }
  }, [router]);

  return (
    <div>
      <AdminNav />
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard</p>
    </div>
  );
}
