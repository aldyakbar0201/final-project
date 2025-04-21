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
  const [password, setPassword] = useState(initialData?.password ?? '');
  const [role, setRole] = useState(initialData?.role ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Role:</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <button type="submit">{submitText}</button>
    </form>
  );
}
