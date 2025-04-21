'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { useToast } from '@/component/ui/use-toast';
import { createCategory } from '@/lib/api';

export default function CreateCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      await createCategory({ name });

      toast({
        title: 'Category created',
        description: 'The category has been created successfully',
      });

      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error creating category',
        description: 'An error occurred while creating the category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Category</h1>

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
          {isSubmitting ? 'Creating...' : 'Create Category'}
        </Button>
      </form>
    </div>
  );
}
