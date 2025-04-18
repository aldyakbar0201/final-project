'use client';

import { useState, FormEvent } from 'react';
import { UserFormProps } from '../shared/types';

export default function UserForm({
  initialData,
  onSubmit,
  submitText,
}: UserFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'store-admin' | 'super-admin'>(
    initialData?.role ?? 'store-admin',
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {!initialData && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}
      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value as 'store-admin' | 'super-admin')
        }
      >
        <option value="store-admin">Store Admin</option>
        <option value="super-admin">Super Admin</option>
      </select>
      <button type="submit">{submitText}</button>
    </form>
  );
}
