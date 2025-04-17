// /app/reports/components/SalesReport.tsx
'use client';

import { SalesReportItem, GroupedSalesReport } from '@/app/types/report';

interface SalesReportProps {
  monthly: SalesReportItem[];
  byCategory: GroupedSalesReport;
  byProduct: GroupedSalesReport;
}

export const SalesReport = ({
  monthly,
  byCategory,
  byProduct,
}: SalesReportProps) => {
  return (
    <div className="space-y-6">
      {/* Monthly Sales */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-3">Penjualan Bulan Ini</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Produk</th>
                <th className="text-left p-3">Toko</th>
                <th className="text-left p-3">Tanggal</th>
                <th className="text-left p-3">Jumlah Terjual</th>
                <th className="text-left p-3">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((report, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-3">{report.Product.name}</td>
                  <td className="p-3">{report.store.name}</td>
                  <td className="p-3">
                    {new Date(report.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3">{report.quantity}</td>
                  <td className="p-3">
                    Rp{report.totalSales.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-3">Penjualan per Kategori</h3>
        {Object.entries(byCategory).map(([category, reports]) => (
          <div key={category} className="mb-4">
            <h4 className="font-medium text-lg">{category}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Produk</th>
                    <th className="text-left p-3">Tanggal</th>
                    <th className="text-left p-3">Jumlah Terjual</th>
                    <th className="text-left p-3">Total Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td className="p-3">{report.Product.name}</td>
                      <td className="p-3">
                        {new Date(report.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-3">{report.quantity}</td>
                      <td className="p-3">
                        Rp{report.totalSales.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Sales by Product */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-3">Penjualan per Produk</h3>
        {Object.entries(byProduct).map(([product, reports]) => (
          <div key={product} className="mb-4">
            <h4 className="font-medium text-lg">{product}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Toko</th>
                    <th className="text-left p-3">Tanggal</th>
                    <th className="text-left p-3">Jumlah Terjual</th>
                    <th className="text-left p-3">Total Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td className="p-3">{report.store.name}</td>
                      <td className="p-3">
                        {new Date(report.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-3">{report.quantity}</td>
                      <td className="p-3">
                        Rp{report.totalSales.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
