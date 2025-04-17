import DiscountForm from '@/component/discountForm';
import DiscountList from '@/component/discountList';

export default function DiscountPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-bold text-center">Discount Management</h1>
      <DiscountForm />
      <hr />
      <DiscountList />
    </div>
  );
}
