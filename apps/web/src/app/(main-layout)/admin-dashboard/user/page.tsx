// UsersPage.tsx
'use client';
// import { useEffect, useState } from 'react';
// // import UserTable from '../../../../component/user-table';
// import { fetchUsers } from '../../../../lib/users';
// import { UserData } from '../../../../shared/types'; // Impor tipe User yang konsisten

export default function UsersPage() {
  // const [users, setUsers] = useState<UserData[]>([]); // ✅ Gunakan tipe User yang konsisten

  // useEffect(() => {
  //   fetchUsers().then((data) => {
  //     // Transformasi data jika `fetchUsers` mengembalikan `id` sebagai number
  //     const transformedUsers = data.map((user) => ({
  //       ...user,
  //       id: user.id.toString(), // Konversi `id` dari number ke string
  //     }));
  //     setUsers(transformedUsers); // ✅ Set data yang sudah ditransformasi
  //   });
  // }, []);
  // console.log(users);
  return (
    <div>
      <h1>Manage Users</h1>
      {/* <UserTable users={users} /> ✅ Pass data yang sudah sesuai */}
    </div>
  );
}
