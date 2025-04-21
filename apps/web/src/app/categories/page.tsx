import Link from 'next/link';
import { Button } from '@/component/ui/button';
import AdminCategoryList from '@/component/admin-category-list';

export default function AdminCategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Link href="/admin/categories/create">
          <Button>Add New Category</Button>
        </Link>
      </div>
      <AdminCategoryList />
    </div>
  );
}
