// components/ProductForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema validasi menggunakan Zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  images: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= 1024 * 1024),
      'File size must be less than 1MB',
    ),
});

// Type inference untuk form values
export type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  onSubmit: SubmitHandler<FormValues>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      <div>
        <label>Price</label>
        <input type="number" {...register('price', { valueAsNumber: true })} />
        {errors.price && <span>{errors.price.message}</span>}
      </div>
      <div>
        <label>Images</label>
        <input
          type="file"
          multiple
          {...register('images')}
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              console.log(files); // Contoh penggunaan variabel `files`
            }
          }}
        />
        {errors.images && <span>{errors.images.message}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
