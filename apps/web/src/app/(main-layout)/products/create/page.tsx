// app/admin/products/create/page.tsx
'use client';
import React from 'react';
import ProductForm from '../../../../component/product-form';
import { SubmitHandler } from 'react-hook-form';
import { FormValues } from '../../../../component/product-form';

const CreateProductPage = () => {
  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    // Kirim data ke API menggunakan Fetch API
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.status === 201) {
      alert('Product created successfully!');
    }
  };

  return (
    <div>
      <h1>Create New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateProductPage;
