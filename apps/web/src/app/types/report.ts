// /app/reports/components/types.ts

// User Types
export interface User {
  id: number;
  role: 'admin' | 'store_admin';
  storeId?: number;
}

// Sales Report Types
export interface SalesReportItem {
  id: number;
  productId: number;
  storeId: number;
  month: number;
  year: number;
  quantity: number;
  totalSales: number;
  createdAt: string; // Added this property
  Product: {
    id: number;
    name: string;
    price: number;
    Category?: {
      id: number;
      name: string;
    };
  };
  store: {
    id: number;
    name: string;
  };
}

export interface GroupedSalesReport {
  [key: string]: SalesReportItem[];
}

// Stock Report Types
export interface StockSummaryItem {
  productId: number;
  productName: string;
  storeId: number;
  storeName: string;
  startStock: number;
  endStock: number;
  totalAdded: number;
  totalReduced: number;
  month: number;
  year: number;
}

export interface StockDetailItem {
  stockLogId: number;
  productId: number;
  productName: string;
  storeId: number;
  storeName: string;
  change: number;
  reason: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
