'use client';

import { useState, useEffect } from 'react';
import ProductCard from './product-card';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductListProps {
  userLocation: GeolocationCoordinates | null;
}

export default function ProductList({ userLocation }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an API call with a delay
    const fetchProducts = async () => {
      setLoading(true);
      // TODO: Replace this with actual API call using userLocation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts([
        {
          id: 1,
          name: 'Apples',
          price: 1.99,
          image: '/placeholder.svg?height=200&width=200',
        },
        {
          id: 2,
          name: 'Bananas',
          price: 0.99,
          image: '/placeholder.svg?height=200&width=200',
        },
        {
          id: 3,
          name: 'Milk',
          price: 2.49,
          image: '/placeholder.svg?height=200&width=200',
        },
      ]);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center">Loading products...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {userLocation ? 'Products Near You' : 'Featured Products'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
