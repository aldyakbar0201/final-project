import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';

// Fungsi untuk mendapatkan laporan penjualan per bulan
export async function getSalesReportByMonth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { month, year, storeId } = req.query; // Ambil bulan, tahun, dan storeId dari query params

  try {
    // Filter laporan penjualan berdasarkan bulan dan tahun
    const salesReports = await prisma.salesReport.findMany({
      where: {
        month: parseInt(month as string),
        year: parseInt(year as string),
        storeId: storeId ? parseInt(storeId as string) : undefined, // Hanya filter storeId jika tersedia
      },
      include: {
        Product: true, // Menyertakan informasi produk terkait
        store: true, // Menyertakan informasi toko terkait
      },
    });

    if (salesReports.length === 0) {
      res
        .status(404)
        .json({ message: 'No sales report found for this period' });
      return;
    }

    res.status(200).json(salesReports); // Kirimkan data laporan penjualan
  } catch (error) {
    console.error('Error fetching sales report:', error);
    next(error); // Pindahkan ke error handler
  }
}

// Fungsi untuk mendapatkan laporan penjualan per bulan berdasarkan kategori produk
export async function getSalesReportByCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { month, year, storeId } = req.query; // Ambil bulan, tahun, dan storeId dari query params

  try {
    // Validasi: Pastikan month dan year ada dalam query
    if (!month || !year) {
      res.status(400).json({ message: 'Month and Year are required' });
      return;
    }
    // Ambil laporan penjualan per kategori produk
    const salesReportsByCategory = await prisma.salesReport.findMany({
      where: {
        month: parseInt(month as string),
        year: parseInt(year as string),
        storeId: storeId ? parseInt(storeId as string) : undefined,
      },
      include: {
        Product: {
          include: {
            Category: true, // Sertakan kategori produk
          },
        },
        store: true,
      },
    });

    if (salesReportsByCategory.length === 0) {
      res
        .status(404)
        .json({ message: 'No sales report found for this period by category' });
      return;
    }

    // Kelompokkan data berdasarkan kategori
    const groupedByCategory = salesReportsByCategory.reduce(
      (acc: { [key: string]: typeof salesReportsByCategory }, report) => {
        const categoryName = report.Product.Category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(report);
        return acc;
      },
      {} as { [key: string]: typeof salesReportsByCategory },
    );

    res.status(200).json(groupedByCategory); // Kirimkan data laporan penjualan per kategori
  } catch (error) {
    console.error('Error fetching sales report by category:', error);
    next(error); // Pindahkan ke error handler
  }
}

// Fungsi untuk mendapatkan laporan penjualan per bulan berdasarkan produk
export async function getSalesReportByProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { month, year, storeId } = req.query; // Ambil bulan, tahun, dan storeId dari query params

  try {
    // Ambil laporan penjualan per produk
    const salesReportsByProduct = await prisma.salesReport.findMany({
      where: {
        year: year ? parseInt(year as string) : undefined,
        storeId: storeId ? parseInt(storeId as string) : undefined,
        month: month ? parseInt(month as string) : undefined, // Ganti dengan nilai bulan yang sesuai
      },
      include: {
        Product: true, // Sertakan produk yang terlibat
        store: true, // Sertakan toko yang terkait
      },
    });

    if (salesReportsByProduct.length === 0) {
      res
        .status(404)
        .json({ message: 'No sales report found for this period by product' });
      return;
    }

    // Kelompokkan data berdasarkan produk
    const groupedByProduct = salesReportsByProduct.reduce(
      (acc: { [key: string]: typeof salesReportsByProduct }, report) => {
        const productName = report.Product.name;
        if (!acc[productName]) {
          acc[productName] = [];
        }
        acc[productName].push(report);
        return acc;
      },
      {} as { [key: string]: typeof salesReportsByProduct },
    );

    res.status(200).json(groupedByProduct); // Kirimkan data laporan penjualan per produk
  } catch (error) {
    console.error('Error fetching sales report by product:', error);
    next(error); // Pindahkan ke error handler
  }
}

// Fungsi untuk mendapatkan ringkasan laporan stok per bulan (Admin/Store Admin)
export async function getStockSummaryReport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { month, year, storeId } = req.query; // Ambil parameter bulan, tahun, dan storeId dari query string

  try {
    if (!month || !year || !storeId) {
      res
        .status(400)
        .json({ message: 'Month, Year, and StoreId are required' });
      return;
    }
    // Ambil laporan stok berdasarkan bulan, tahun, dan storeId
    const stockSummary = await prisma.stockReport.findMany({
      where: {
        storeId: parseInt(storeId as string),
        month: parseInt(month as string),
        year: parseInt(year as string),
      },
      include: {
        Product: true, // Menampilkan produk terkait laporan stok
        Store: true, // Menampilkan toko terkait
      },
    });

    const summary = stockSummary.map((report) => ({
      productId: report.productId,
      productName: report.Product.name,
      storeId: report.storeId,
      storeName: report.Store.name,
      startStock: report.startStock,
      endStock: report.endStock,
      totalAdded: report.totalAdded,
      totalReduced: report.totalReduced,
      month: report.month,
      year: report.year,
    }));

    res.status(200).json(summary); // Mengirimkan ringkasan laporan stok
  } catch (error) {
    console.error('Error fetching stock summary report:', error);
    next(error);
  }
}

// Fungsi untuk mendapatkan detail laporan stok per produk per bulan (Admin/Store Admin)
export async function getStockDetailReport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { month, year, productId, storeId } = req.query;

  try {
    // Pastikan bulan, tahun, storeId, dan productId ada dalam query
    if (!month || !year || !storeId || !productId) {
      res
        .status(400)
        .json({ message: 'Month, Year, ProductId, and StoreId are required' });
      return;
    }

    // Parse parameter menjadi integer
    const monthInt = parseInt(month as string);
    const yearInt = parseInt(year as string);
    const productIdInt = parseInt(productId as string);
    const storeIdInt = parseInt(storeId as string);

    // Validasi jika parameter tidak valid
    if (
      isNaN(monthInt) ||
      isNaN(yearInt) ||
      isNaN(productIdInt) ||
      isNaN(storeIdInt)
    ) {
      res
        .status(400)
        .json({ message: 'Invalid month, year, productId, or storeId' });
      return;
    }

    // Validasi untuk bulan dan tahun
    if (monthInt < 1 || monthInt > 12 || yearInt < 1000 || yearInt > 9999) {
      res.status(400).json({ message: 'Invalid month or year' });
      return;
    }

    // Membuat rentang waktu berdasarkan bulan dan tahun
    const startDate = new Date(yearInt, monthInt - 1, 1); // Awal bulan
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59); // Akhir bulan

    // Ambil detail laporan stok berdasarkan filter bulan, tahun, productId, dan storeId
    const stockDetails = await prisma.stockLog.findMany({
      where: {
        stock: {
          productId: productIdInt,
          storeId: storeIdInt,
        },
        createdAt: {
          gte: startDate, // greater than or equal to start of the month
          lte: endDate, // less than or equal to end of the month
        },
      },
      include: {
        stock: {
          include: {
            product: true, // Menampilkan produk terkait stok
            store: true, // Menampilkan toko terkait stok
          },
        },
      },
    });

    // Menyusun data laporan stok menjadi format yang diinginkan
    const details = stockDetails.map((log) => ({
      stockLogId: log.id,
      productId: log.stock.productId,
      productName: log.stock.product.name,
      storeId: log.stock.storeId,
      storeName: log.stock.store.name,
      change: log.change,
      reason: log.reason,
      createdAt: log.createdAt,
    }));

    // Jika tidak ada data yang ditemukan
    if (details.length === 0) {
      res.status(404).json({ message: 'No stock details found' });
      return;
    }

    // Mengirimkan detail laporan stok per produk per bulan
    res.status(200).json(details);
  } catch (error) {
    console.error('Error fetching stock detail report:', error);
    next(error); // Pindahkan error ke middleware error handler
  }
}
