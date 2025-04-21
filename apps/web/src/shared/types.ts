// shared/types.ts
export interface UserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'STORE_ADMIN' | 'SUPEE_ADMIN'; // Adjust roles as per your app
}

// src/shared/types.ts

export interface UserFormProps {
  initialData?: {
    name?: string;
    email?: string;
    password?: string;
    role?: string | string[]; // Optional role property (string or array of strings)
  };
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    role?: string | string[]; // Optional role property
  }) => void;
  submitText: string;
}
