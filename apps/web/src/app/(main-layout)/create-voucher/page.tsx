'use client';

import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState, useRef } from 'react'; // ADDED: useRef for click outside detection

interface CreateVoucherForm {
  code: string;
  type: 'PRODUCT_SPECIFIC' | 'TOTAL_PURCHASE' | 'SHIPPING';
  value: number;
  productId?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  store: string;
  isOutOfStock: boolean;
}

export default function CreateVoucherPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreateVoucherForm>();
  const voucherType = watch('type'); // Watch the type field for changes
  const [products, setProducts] = useState<Product[]>([]);

  // ADDED: State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ADDED: Ref for dropdown container to detect clicks outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ADDED: Effect to handle clicks outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/products`,
        );
        const data = await response.json();
        setProducts(data || []);
        // console.log(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  // ADDED: Function to filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ADDED: Function to handle product selection
  const handleSelectProduct = (product: Product) => {
    setValue('productId', product.id, { shouldValidate: true });
    setSelectedProduct(product);
    setDropdownOpen(false);
    setSearchTerm(''); // Reset search term when product is selected
  };

  async function CreateVoucher(data: CreateVoucherForm) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vouchers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: data.code,
            type: data.type,
            value: data.value,
            productId: data.type === 'PRODUCT_SPECIFIC' ? data.productId : null,
          }),
        },
      );

      await response.json();

      if (response.ok) {
        toast.success('Voucher created successfully!');
      } else {
        toast.error('Failed to create voucher');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create voucher');
    }
  }

  return (
    <section className="max-w-md mx-auto my-10 p-8 bg-white rounded-lg shadow-2xl border-2 border-green-700">
      <h1 className="text-2xl font-bold text-lime-600 mb-6 pb-2 border-b border-gray-100 text-center">
        Create Voucher
      </h1>
      <form onSubmit={handleSubmit(CreateVoucher)} className="space-y-6">
        {/* Code Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Code
            <input
              {...register('code', {
                required: 'Code is required',
                maxLength: {
                  value: 10,
                  message: 'Code cannot exceed 10 characters',
                },
              })}
              name="code"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
            />
          </label>
          {errors.code && (
            <span className="text-red-500 text-sm">{errors.code.message}</span>
          )}
        </div>

        {/* Type Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type
            <select
              {...register('type', { required: 'type is required' })}
              name="type"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
            >
              <option value="TOTAL_PURCHASE">Total Purchase</option>
              <option value="PRODUCT_SPECIFIC">Product Specific</option>
              <option value="SHIPPING">Shipping</option>
            </select>
          </label>
          {errors.type && (
            <span className="text-red-500 text-sm">{errors.type.message}</span>
          )}
        </div>

        {/* MODIFIED: Conditionally Render Product Selection with Search */}
        {voucherType === 'PRODUCT_SPECIFIC' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Product
              {/* ADDED: Hidden input for React Hook Form validation */}
              <input
                type="hidden"
                {...register('productId', {
                  valueAsNumber: true,
                  required:
                    voucherType === 'PRODUCT_SPECIFIC'
                      ? 'Product selection is required'
                      : false,
                })}
              />
              {/* ADDED: Product selection container with ref for click outside detection */}
              <div className="mt-2 relative" ref={dropdownRef}>
                {/* ADDED: Search input */}
                <input
                  type="text"
                  placeholder="Search for a product..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setDropdownOpen(true); // Open dropdown when typing
                  }}
                  onFocus={() => setDropdownOpen(true)}
                />

                {/* ADDED: Selected product display */}
                <div
                  className="mt-2 flex items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {selectedProduct ? (
                    <span>
                      {selectedProduct.name} (ID: {selectedProduct.id})
                    </span>
                  ) : (
                    <span className="text-gray-500">Select a product</span>
                  )}
                  <svg
                    className="w-5 h-5 ml-auto text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* ADDED: Dropdown with search results */}
                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                    <ul className="max-h-60 overflow-auto py-1">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <li
                            key={product.id}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectProduct(product)}
                          >
                            {product.name} (ID: {product.id})
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-gray-500">
                          No products found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </label>
            {errors.productId && (
              <span className="text-red-500 text-sm">
                {errors.productId.message as string}
              </span>
            )}
          </div>
        )}

        {/* Value Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Value
            <input
              {...register('value', {
                valueAsNumber: true,
                setValueAs: (v) => parseFloat(v) || 0,
                required: 'Value is required',
                min: {
                  value: 0,
                  message: 'Value must be greater than or equal to 0',
                },
              })}
              type="number"
              step="any"
              name="value"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
            />
          </label>
          {errors.value && (
            <span className="text-red-500 text-sm">{errors.value.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 mt-6 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors duration-200"
        >
          Create Voucher
        </button>
        <ToastContainer />
      </form>
    </section>
  );
}
