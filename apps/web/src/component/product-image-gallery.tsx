'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/component/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/component/ui/use-toast';
import { deleteProductImage } from '@/lib/api';

interface ProductImageGalleryProps {
  images: string[];
  productId: string | number;
}

export default function ProductImageGallery({
  images,
  productId,
}: ProductImageGalleryProps) {
  const { toast } = useToast();
  const [currentImages, setCurrentImages] = useState<string[]>(images);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  const handleDeleteImage = async (imageUrl: string) => {
    // Extract image ID from URL or use the full URL
    const imageId = imageUrl.split('/').pop() || imageUrl;

    setIsDeleting((prev) => ({ ...prev, [imageUrl]: true }));

    try {
      await deleteProductImage(productId, imageId);

      setCurrentImages((prev) => prev.filter((img) => img !== imageUrl));

      toast({
        title: 'Image deleted',
        description: 'The image has been removed successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error deleting image',
        description: 'An error occurred while deleting the image',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [imageUrl]: false }));
    }
  };

  if (currentImages.length === 0) {
    return <p className="text-sm text-gray-500">No images available</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {currentImages.map((imageUrl, index) => (
        <div
          key={index}
          className="relative aspect-square border rounded-md overflow-hidden"
        >
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={`Product image ${index + 1}`}
            fill
            className="object-cover"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-1 right-1 h-8 w-8 p-0"
            onClick={() => handleDeleteImage(imageUrl)}
            disabled={isDeleting[imageUrl]}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
