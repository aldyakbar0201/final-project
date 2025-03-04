'use client';
import { useEffect, useState } from 'react';
import UserTable from '../../../component/user-table';
import { fetchUsers } from '../../../lib/users';

type User = {
  id: number;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]); // ✅ Explicitly define type

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data)); // ✅ Ensure fetchUsers returns User[]
  }, []);

  return (
    <div>
      <h1>Manage Users</h1>
      <UserTable users={users} />
    </div>
  );
}
