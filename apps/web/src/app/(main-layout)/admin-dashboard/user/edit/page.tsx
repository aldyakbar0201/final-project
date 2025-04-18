'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchUserById, updateUser } from '../../../../../lib/users';
import UserForm from '../../../../../component/useForm';
import { UserFormData } from '../../../../../shared/types';

export default function EditUserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');
  const [initialData, setInitialData] = useState<UserFormData | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserById(userId).then((data) => {
        const { name, email, role } = data;

        // ✅ Hanya izinkan role 'super-admin' dan 'store-admin'
        if (role === 'super-admin' || role === 'store-admin') {
          setInitialData({ name, email, role });
        } else {
          alert('Cannot edit users with this role');
          router.push('/admin/users');
        }
      });
    }
  }, [userId, router]);

  const handleUpdate = async (data: UserFormData) => {
    if (userId) {
      await updateUser(userId, data);
      router.push('/admin/users');
    }
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit User</h1>
      <UserForm
        initialData={initialData}
        onSubmit={handleUpdate}
        submitText="Update User"
      />
    </div>
  );
}
