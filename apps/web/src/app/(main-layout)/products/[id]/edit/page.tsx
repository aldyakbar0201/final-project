'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/component/ui/select';
import { Label } from '@/component/ui/label';
import { useToast } from '@/component/ui/use-toast';
import {
  getProductDetail,
  updateProduct,
  uploadProductImages,
} from '@/lib/api';
import { useCategories } from '@/app/hooks/use-categories';
import { useStores } from '@/app/hooks/use.stores';
import ProductImageUpload from '@/component/product-image-upload';
import ProductImageGallery from '@/component/product-image-gallery';
import type { AdminProduct } from '@/lib/types';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  storeId: string;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { stores, isLoading: isStoresLoading } = useStores();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    storeId: '',
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductDetail(params.id);
        if (product) {
          setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            categoryId: product.categoryId?.toString() || '',
            storeId: product.storeId?.toString() || '',
          });
          setExistingImages(product.images || []);
        }
      } catch (error) {
        toast({
          title: 'Error loading product',
          description:
            error instanceof Error
              ? error.message
              : 'Could not load product details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (files: File[]) => {
    setNewImages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (
        !formData.name ||
        !formData.price ||
        !formData.categoryId ||
        !formData.storeId
      ) {
        toast({
          title: 'Missing required fields',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Convert string values to numbers for the API
      const productData: Partial<AdminProduct> = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        categoryId: Number.parseInt(formData.categoryId),
        storeId: Number.parseInt(formData.storeId),
      };

      // Update product
      await updateProduct(params.id, productData);

      // Upload new images if any
      if (newImages.length > 0) {
        await uploadProductImages(params.id, newImages);
      }

      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully',
      });

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error updating product',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating the product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isCategoriesLoading || isStoresLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleSelectChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeId">Store</Label>
          <Select
            value={formData.storeId}
            onValueChange={(value) => handleSelectChange('storeId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a store" />
            </SelectTrigger>
            <SelectContent>
              {stores?.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Current Images</Label>
          {existingImages.length > 0 ? (
            <ProductImageGallery
              images={existingImages}
              productId={params.id}
            />
          ) : (
            <p className="text-sm text-gray-500">No images available</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Add New Images</Label>
          <ProductImageUpload onChange={handleImageChange} />
          <p className="text-sm text-gray-500">
            Allowed formats: JPG, JPEG, PNG, GIF. Max size: 1MB per image.
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Product'}
        </Button>
      </form>
    </div>
  );
}
