'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { useToast } from '@/component/ui/use-toast';
import { getCategory, updateCategory } from '@/lib/api';

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await getCategory(params.id);
        if (category) {
          setName(category.name);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast({
          title: 'Error loading category',
          description: 'Could not load category details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        toast({
          title: 'Category name required',
          description: 'Please enter a category name',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      await updateCategory(params.id, { name });

      toast({
        title: 'Category updated',
        description: 'The category has been updated successfully',
      });

      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error updating category',
        description: 'An error occurred while updating the category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Category'}
        </Button>
      </form>
    </div>
  );
}
