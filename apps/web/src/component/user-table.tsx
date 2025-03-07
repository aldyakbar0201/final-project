import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: 'super-admin' | 'store-admin' | 'user'; // Adjust based on your roles
}

export default function UserTable({ users }: { users: User[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <Link href={`/admin/users/edit?id=${user.id}`}>Edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
