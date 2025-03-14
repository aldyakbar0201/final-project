// app/store-admin/products/page.tsx
import React from 'react';

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

const StoreAdminProductsPage = async () => {
  const products = await fetchProducts();

  return (
    <div>
      <h1>Product List (Read Only)</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreAdminProductsPage;
