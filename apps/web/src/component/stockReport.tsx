// /app/reports/components/StockReport.tsx
'use client';

import { StockSummaryItem, StockDetailItem } from '@/app/types/report';

interface StockReportProps {
  summary: StockSummaryItem[];
  detail: StockDetailItem[];
  onProductSelect: (productId: number) => void;
  selectedProductId: number | null;
}

export const StockReport = ({
  summary,
  detail,
  onProductSelect,
  selectedProductId,
}: StockReportProps) => {
  return (
    <div className="space-y-6">
      {/* Stock Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-3">Ringkasan Stok</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Produk</th>
                <th className="text-left p-3">Stok Awal</th>
                <th className="text-left p-3">Penambahan</th>
                <th className="text-left p-3">Pengurangan</th>
                <th className="text-left p-3">Stok Akhir</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.startStock}</td>
                  <td className="p-3 text-green-600">+{item.totalAdded}</td>
                  <td className="p-3 text-red-600">-{item.totalReduced}</td>
                  <td className="p-3 font-medium">{item.endStock}</td>
                  <td className="p-3">
                    <button
                      onClick={() => onProductSelect(item.productId)}
                      className={`${selectedProductId === item.productId ? 'text-blue-800 font-medium' : 'text-blue-600'} hover:text-blue-800`}
                    >
                      {selectedProductId === item.productId
                        ? 'Sedang Ditampilkan'
                        : 'Lihat Detail'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Detail */}
      {selectedProductId && detail.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-3">Detail History Stok</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Tanggal</th>
                  <th className="text-left p-3">Perubahan</th>
                  <th className="text-left p-3">Alasan</th>
                </tr>
              </thead>
              <tbody>
                {detail.map((log, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-50' : ''}
                  >
                    <td className="p-3">
                      {new Date(log.createdAt).toLocaleString('id-ID')}
                    </td>
                    <td
                      className={`p-3 ${log.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {log.change > 0 ? '+' : ''}
                      {log.change}
                    </td>
                    <td className="p-3">{log.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
