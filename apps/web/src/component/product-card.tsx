import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Badge } from '@/component/ui/badge';
import AddToCartButton from './add-to-cart-button';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0] || '/placeholder.svg?height=300&width=300'}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-400">No image</p>
            </div>
          )}

          {product.isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-lg mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <p className="font-bold text-lg mb-3">${product.price}</p>
        </Link>

        <AddToCartButton
          productId={product.id}
          isOutOfStock={product.isOutOfStock}
          buttonVariant="outline"
        />
      </div>
    </div>
  );
}
