// app/(main-layout)/store-admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/products`,
  );
  return res.json();
};

const StoreAdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await fetchProducts();
      setProducts(productsData);
    };

    loadProducts();
  }, []);

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
