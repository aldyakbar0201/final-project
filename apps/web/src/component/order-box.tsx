'use client';

import Image from 'next/image';
import { useState } from 'react';

type OrderStatus =
  | 'Pending'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';
type ShippingStatus = 'Not Shipped' | 'Preparing' | 'In Transit' | 'Delivered';

interface OrderDetails {
  id: string;
  status: OrderStatus;
  date: string;
  products: {
    name: string;
    quantity: number;
    image: string;
  }[];
  totalPrice: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    method: string;
    status: ShippingStatus;
    trackingNumber?: string;
  };
  payment: {
    method: string;
    status: 'Pending' | 'Approved' | 'Declined';
  };
}

export default function OrderManagementDashboard() {
  // Sample order data - in a real app, this would come from an API
  const [order, setOrder] = useState<OrderDetails>({
    id: 'Order 1',
    status: 'Pending',
    date: '18 / 12 / 2001',
    products: [
      { name: 'Banana', quantity: 2, image: '/home.svg' },
      { name: 'Tomato', quantity: 3, image: '/home.svg' },
      { name: 'Mushroom', quantity: 1, image: '/home.svg' },
      { name: 'Potato', quantity: 1, image: '/home.svg' },
      { name: 'Lettuce', quantity: 5, image: '/home.svg' },
    ],
    totalPrice: 'Rp50.000',
    customer: {
      name: 'Maria Aniston',
      email: 'mariaaniston@wholesaletronics.com',
      phone: '+1 (065) 786 55 67',
    },
    shipping: {
      method: 'Next express',
      status: 'Not Shipped',
    },
    payment: {
      method: 'Stripe',
      status: 'Pending',
    },
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);

  // Update order status
  const updateOrderStatus = (newStatus: OrderStatus) => {
    setOrder({ ...order, status: newStatus });
    setShowStatusModal(false);
  };

  // Update shipping status
  const updateShippingStatus = (
    newStatus: ShippingStatus,
    trackingNumber?: string,
  ) => {
    setOrder({
      ...order,
      shipping: {
        ...order.shipping,
        status: newStatus,
        trackingNumber: trackingNumber || order.shipping.trackingNumber,
      },
    });
    setShowShippingModal(false);
  };

  // Confirm payment
  const confirmPayment = () => {
    setOrder({
      ...order,
      payment: {
        ...order.payment,
        status: 'Approved',
      },
    });
  };

  // Get appropriate status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Payment Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShippingStatusColor = (status: ShippingStatus) => {
    switch (status) {
      case 'Not Shipped':
        return 'bg-gray-100 text-gray-800';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800';
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (
    status: 'Pending' | 'Approved' | 'Declined',
  ) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <section className="m-4 md:m-8 lg:m-20">
        <h1 className="text-3xl md:text-5xl font-bold">Order Management</h1>

        {/* Order Card */}
        <div className="mt-5 border-2 border-gray-200 p-4 md:p-5 rounded-xl shadow-md">
          {/* Header with Order Status */}
          <div className="flex flex-col md:flex-row md:justify-between mb-4 px-2 pb-4 border-b-2 border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <h3 className="text-xl md:text-2xl font-bold">{order.id}</h3>
              <span
                className={`rounded-full px-3 py-1 text-sm ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>
              <span className="text-gray-600">{order.date}</span>
            </div>
            <div className="mt-3 md:mt-0">
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors mr-2"
              >
                Update Status
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="flex flex-col md:flex-row justify-between">
              {/* Product List */}
              <div className="flex gap-3">
                <Image
                  src={order.products[0].image}
                  width={100}
                  height={100}
                  alt="product thumbnail"
                  className="bg-white p-3 border border-gray-200 rounded"
                />
                <div>
                  <p className="text-xl font-bold">
                    {order.products.map((p) => p.name).join(', ')}
                  </p>
                  <p className="text-gray-600">
                    {order.products.map((p) => `x${p.quantity}`).join(', ')}
                  </p>
                </div>
              </div>
              {/* Total Price */}
              <div className="mt-4 md:mt-0 md:mr-4">
                <p className="text-lg font-semibold">Total Price</p>
                <p className="text-xl font-bold text-green-600">
                  {order.totalPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Payment & Shipping Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Payment Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Payment</h3>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${getPaymentStatusColor(order.payment.status)}`}
                >
                  {order.payment.status}
                </span>
              </div>
              <p>
                <span className="text-gray-600">Method:</span>{' '}
                {order.payment.method}
              </p>

              {order.payment.status === 'Pending' && (
                <button
                  onClick={confirmPayment}
                  className="mt-3 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                >
                  Confirm Payment
                </button>
              )}
            </div>

            {/* Shipping Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Shipping</h3>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${getShippingStatusColor(order.shipping.status)}`}
                >
                  {order.shipping.status}
                </span>
              </div>
              <p>
                <span className="text-gray-600">Method:</span>{' '}
                {order.shipping.method}
              </p>
              {order.shipping.trackingNumber && (
                <p>
                  <span className="text-gray-600">Tracking:</span>{' '}
                  {order.shipping.trackingNumber}
                </p>
              )}

              <button
                onClick={() => setShowShippingModal(true)}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
              >
                Update Shipping
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Order Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
            <div className="space-y-3">
              {(
                [
                  'Pending',
                  'Payment Confirmed',
                  'Processing',
                  'Shipped',
                  'Delivered',
                  'Completed',
                  'Cancelled',
                ] as OrderStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(status)}
                  className={`block w-full text-left p-3 rounded-lg ${
                    order.status === status
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Status Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Shipping Status</h3>
            <div className="space-y-3">
              {(
                [
                  'Not Shipped',
                  'Preparing',
                  'In Transit',
                  'Delivered',
                ] as ShippingStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => updateShippingStatus(status)}
                  className={`block w-full text-left p-3 rounded-lg ${
                    order.shipping.status === status
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            {order.shipping.status === 'In Transit' && (
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter tracking number"
                  value={order.shipping.trackingNumber || ''}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      shipping: {
                        ...order.shipping,
                        trackingNumber: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowShippingModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateShippingStatus(
                    order.shipping.status,
                    order.shipping.trackingNumber,
                  )
                }
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
