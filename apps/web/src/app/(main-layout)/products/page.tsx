import React from 'react';
import Link from 'next/link';
import DeleteButton from './_components/delete-product-button'; // import here

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/admin/products`,
    {
      cache: 'no-store',
    },
  );
  return res.json();
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
          <li key={product.id} className="flex items-center">
            <Link href={`/admin/products/${product.id}`}>
              {product.name} - ${product.price}
            </Link>
            <DeleteButton productId={product.id} />{' '}
            {/* use Client Component here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductsPage;
