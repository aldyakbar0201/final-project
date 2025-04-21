// app/admin/products/edit/[id]/page.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../../../../../component/product-form';
import { SubmitHandler } from 'react-hook-form';
import { FormValues } from '../../../../../component/product-form';

const EditProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    // Update data ke API menggunakan Fetch API
    const id = (await params).id;
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, id }), // Tambahkan `id` ke data yang dikirim
    });
    if (res.status === 200) {
      alert('Product updated successfully!');
      router.push('/admin/products');
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProductPage;
