import Link from 'next/link';
import { Button } from '@/component/ui/button';
import AdminProductList from '@/component/admin-product-list';

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link href="/admin/products/create">
          <Button>Add New Product</Button>
        </Link>
      </div>
      <AdminProductList />
    </div>
  );
}
