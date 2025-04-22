'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  productId: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ productId }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/admin/products/${productId}`,
        {
          method: 'DELETE',
        },
      );
      if (res.status === 200) {
        alert('Product deleted successfully!');
        router.refresh(); // Nice refresh without reload
      } else {
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="ml-4 text-red-500">
      Delete
    </button>
  );
};

export default DeleteButton;
