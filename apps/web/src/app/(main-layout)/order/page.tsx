'use client';

import Image from 'next/image';
import OrderManagementDashboard from '@/component/order-box';
import { useEffect, useState } from 'react';

// TypeScript interfaces based on the JSON response
interface ProductImage {
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  ProductImage: ProductImage[];
}

interface OrderItem {
  id: string;
  orderId: string;
  cartId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  Product: Product;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: string;
  userId: number;
  storeId: number;
  addressId: number;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string;
  paymentProof: string | null;
  paymentProofTime: string | null;
  paymentDueDate: string;
  shippingMethod: string;
  shippingCost: number;
  discountTotal: number;
  total: number;
  notes: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  OrderItems: OrderItem[];
  User: User;
}

export default function Order() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await response.json();
        setOrder(data[0]);

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
  };

  // Format status by replacing underscores with spaces and capitalizing
  const formatStatus = (status: string): string => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading || !order) {
    return (
      <section className="m-20">
        <h1 className="text-5xl font-bold">Orders</h1>
        <div className="mt-5">Loading order details...</div>
      </section>
    );
  }

  console.log(order);

  return (
    <>
      <section className="m-20">
        <h1 className="text-5xl font-bold">Orders</h1>

        {/* CARD */}
        <div className="mt-5 border-2 border-lime-600 p-5 rounded-xl">
          {/* HEADER */}
          <div className="flex gap-10 mb-4 px-2 border-b-2 items-center">
            <h3 className="text-2xl">{order.orderNumber}</h3>
            <span>{formatDate(order.createdAt)}</span>
            <span>{formatStatus(order.orderStatus)}</span>
          </div>

          {/* PRODUCT */}
          <div className="flex justify-between">
            {/* PRODUCT MAIN */}
            <div className="flex gap-5">
              <Image
                src={
                  order.OrderItems?.[0]?.Product?.ProductImage?.[0]?.imageUrl ||
                  '/home.svg'
                }
                width={100}
                height={100}
                alt="product image"
                className="bg-white rounded-lg"
              />
              <div>
                <p className="text-2xl font-bold">
                  {order.OrderItems?.map((item) => item.Product.name).join(
                    ', ',
                  )}
                </p>
                <p>
                  {order.OrderItems?.map((item) => `x${item.quantity}`).join(
                    ', ',
                  )}
                </p>
              </div>
            </div>

            {/* TOTAL PRICE */}
            <div className="mr-20 my-2">
              <p className="text-xl font-bold">Total Price</p>
              <p className="text-lg">Rp{order.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <OrderManagementDashboard />
    </>
  );
}
