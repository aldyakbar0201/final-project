import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: 'super-admin' | 'store-admin' | 'user'; // Sesuaikan dengan peran yang ada
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <table
      style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f4f4f4' }}>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              {user.email}
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              {user.role}
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <Link
                href={`/admin/users/edit?id=${user.id}`}
                style={{ color: '#0070f3', textDecoration: 'none' }}
                aria-label={`Edit user ${user.email}`}
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
