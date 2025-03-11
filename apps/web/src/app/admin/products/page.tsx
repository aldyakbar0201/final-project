// app/admin/products/page.tsx
import React from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch('http://localhost:3000/api/products');
  return res.json();
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (res.status === 200) {
      alert('Product deleted successfully!');
      window.location.reload(); // Reload halaman setelah menghapus
    } else {
      alert('Failed to delete product.');
    }
  }
};

const AdminProductsPage = async () => {
  const products = await fetchProducts();

  return (
    <div>
      <h1>Product Management</h1>
      <Link href="/admin/products/create">
        <button>Create New Product</button>
      </Link>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/admin/products/${product.id}`}>
              {product.name} - ${product.price}
            </Link>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductsPage;
