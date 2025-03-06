import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Image
        src={product.image || '/placeholder.svg'}
        alt={product.name}
        width={200}
        height={200}
        layout="responsive"
      />
      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center w-full">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
