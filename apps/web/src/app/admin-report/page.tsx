// /app/reports/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DateFilter } from '@/component/dateFilter';
import { SalesReport } from '@/component/salesReport';
import { StockReport } from '@/component/stockReport';
import {
  SalesReportItem,
  GroupedSalesReport,
  StockSummaryItem,
  StockDetailItem,
  User,
} from '@/app/types/report';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export default function ReportsPage() {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [stores, setStores] = useState<{ id: number; name: string }[]>([]);

  // Report data states
  const [salesData, setSalesData] = useState<{
    monthly: SalesReportItem[];
    byCategory: GroupedSalesReport;
    byProduct: GroupedSalesReport;
  }>({
    monthly: [],
    byCategory: {},
    byProduct: {},
  });

  const [stockData, setStockData] = useState<{
    summary: StockSummaryItem[];
    detail: StockDetailItem[];
  }>({
    summary: [],
    detail: [],
  });

  const [loading, setLoading] = useState({
    user: true,
    stores: true,
    sales: false,
    stock: false,
  });

  const [error, setError] = useState({
    user: '',
    stores: '',
    sales: '',
    stock: '',
  });

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      setError((prev) => ({ ...prev, user: '' }));

      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData: User = await response.json();
      setUser(userData);

      // Set storeId for store admins
      if (userData.role === 'store_admin' && userData.storeId) {
        setStoreId(userData.storeId);
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        user: err instanceof Error ? err.message : 'Unknown error',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  }, []);

  // Fetch stores list
  const fetchStores = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, stores: true }));
      setError((prev) => ({ ...prev, stores: '' }));

      const response = await fetch(`${API_BASE_URL}/stores`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }

      const storesData = await response.json();
      setStores(storesData);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        stores: err instanceof Error ? err.message : 'Unknown error',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, stores: false }));
    }
  }, []);

  // Fetch sales reports
  const fetchSalesReports = useCallback(
    async (year: number, month: number, storeId: number | null) => {
      try {
        setLoading((prev) => ({ ...prev, sales: true }));
        setError((prev) => ({ ...prev, sales: '' }));

        const params = new URLSearchParams({
          year: year.toString(),
          month: month.toString(),
          ...(storeId && { storeId: storeId.toString() }),
        });

        const [monthlyRes, byCategoryRes, byProductRes] = await Promise.all([
          fetch(
            `${API_BASE_URL}/report/sales-reports/month?${params.toString()}`,
            {
              credentials: 'include',
            },
          ),
          fetch(
            `${API_BASE_URL}/report/sales-reports/category?${params.toString()}`,
            {
              credentials: 'include',
            },
          ),
          fetch(
            `${API_BASE_URL}/report/sales-reports/product?${params.toString()}`,
            {
              credentials: 'include',
            },
          ),
        ]);

        if (!monthlyRes.ok || !byCategoryRes.ok || !byProductRes.ok) {
          throw new Error('Failed to fetch sales reports');
        }

        const [monthly, byCategory, byProduct] = await Promise.all([
          monthlyRes.json(),
          byCategoryRes.json(),
          byProductRes.json(),
        ]);

        setSalesData({ monthly, byCategory, byProduct });
      } catch (err) {
        setError((prev) => ({
          ...prev,
          sales: err instanceof Error ? err.message : 'Unknown error',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, sales: false }));
      }
    },
    [],
  );

  // Fetch stock reports
  const fetchStockReports = useCallback(
    async (
      year: number,
      month: number,
      storeId: number | null,
      productId: number | null,
    ) => {
      try {
        setLoading((prev) => ({ ...prev, stock: true }));
        setError((prev) => ({ ...prev, stock: '' }));

        const params = new URLSearchParams({
          year: year.toString(),
          month: month.toString(),
          ...(storeId && { storeId: storeId.toString() }),
        });

        const summaryRes = await fetch(
          `${API_BASE_URL}/report/stock-reports/summary?${params.toString()}`,
          {
            credentials: 'include',
          },
        );

        if (!summaryRes.ok) {
          throw new Error('Failed to fetch stock summary');
        }

        const summary = await summaryRes.json();
        setStockData((prev) => ({ ...prev, summary }));

        // Fetch detail if product is selected
        if (productId) {
          const detailParams = new URLSearchParams({
            ...params,
            productId: productId.toString(),
          });

          const detailRes = await fetch(
            `${API_BASE_URL}/report/stock-reports/detail?${detailParams.toString()}`,
            {
              credentials: 'include',
            },
          );

          if (!detailRes.ok) {
            throw new Error('Failed to fetch stock details');
          }

          const detail = await detailRes.json();
          setStockData((prev) => ({ ...prev, detail }));
        } else {
          setStockData((prev) => ({ ...prev, detail: [] }));
        }
      } catch (err) {
        setError((prev) => ({
          ...prev,
          stock: err instanceof Error ? err.message : 'Unknown error',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, stock: false }));
      }
    },
    [],
  );

  // Handle filter changes
  const handleFilterChange = (
    newYear: number,
    newMonth: number,
    newStoreId: number | null,
  ) => {
    setYear(newYear);
    setMonth(newMonth);
    setStoreId(newStoreId);
    setProductId(null); // Reset product selection when filters change
  };

  // Handle product selection for stock detail
  const handleProductSelect = (selectedProductId: number) => {
    setProductId(selectedProductId === productId ? null : selectedProductId);
  };

  // Initial data load
  useEffect(() => {
    fetchUser();
    fetchStores();
  }, [fetchUser, fetchStores]);

  // Fetch reports when filters or product selection changes
  useEffect(() => {
    if (!user || loading.user || loading.stores) return;

    // For store admins, we must have a storeId
    if (user.role === 'store_admin' && !storeId) return;

    fetchSalesReports(year, month, storeId);
    fetchStockReports(year, month, storeId, productId);
  }, [
    year,
    month,
    storeId,
    productId,
    user,
    loading.user,
    loading.stores,
    fetchSalesReports,
    fetchStockReports,
  ]);

  if (loading.user || loading.stores) {
    return <div className="p-4 text-center text-gray-500">Memuat data...</div>;
  }

  if (error.user || error.stores) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded">
        Error: {error.user || error.stores}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Laporan & Analisis</h1>

      {/* Filter Component */}
      <DateFilter
        initialYear={year}
        initialMonth={month}
        initialStoreId={storeId}
        userRole={user?.role || 'admin'}
        stores={stores}
        onFilterChange={handleFilterChange}
      />

      {/* Sales Reports */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Laporan Penjualan</h2>

        {error.sales && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">
            Error: {error.sales}
          </div>
        )}

        {loading.sales ? (
          <div className="p-4 text-center text-gray-500">
            Memuat data penjualan...
          </div>
        ) : (
          <SalesReport
            monthly={salesData.monthly}
            byCategory={salesData.byCategory}
            byProduct={salesData.byProduct}
          />
        )}
      </div>

      {/* Stock Reports */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Laporan Stok</h2>

        {error.stock && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">
            Error: {error.stock}
          </div>
        )}

        {loading.stock ? (
          <div className="p-4 text-center text-gray-500">
            Memuat data stok...
          </div>
        ) : (
          <StockReport
            summary={stockData.summary}
            detail={stockData.detail}
            onProductSelect={handleProductSelect}
            selectedProductId={productId}
          />
        )}
      </div>
    </div>
  );
}
