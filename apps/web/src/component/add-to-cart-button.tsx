'use client';

import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/component/ui/use-toast';
import { addToCart } from '@/lib/api';

interface AddToCartButtonProps {
  productId: number | string;
  isOutOfStock: boolean;
  buttonVariant?: 'default' | 'outline' | 'secondary';
}

export default function AddToCartButton({
  productId,
  isOutOfStock,
  buttonVariant = 'default',
}: AddToCartButtonProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    setIsAdding(true);
    try {
      const userId = 1; // Placeholder
      await addToCart(userId, productId, 1);

      toast({
        title: 'Added to cart',
        description: 'Product has been added to your cart',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Could not add product to cart',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isAdding}
      variant={buttonVariant}
      className="w-full"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}
