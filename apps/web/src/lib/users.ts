export async function fetchUsers() {
  return [
    { id: 1, email: 'storeadmin@example.com', role: 'store-admin' },
    { id: 2, email: 'admin@example.com', role: 'super-admin' },
  ];
}

export function getSession() {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  }
  return null;
}

export type User = {
  id: number; // Ensure this matches the database
  email: string;
  role: string;
};
