import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js'; // Prisma Client

// Fungsi untuk mendapatkan daftar stok produk berdasarkan toko (Admin/Store Admin)
export async function getStockByStore(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const storeId = parseInt(req.params.storeId); // Ambil storeId dari parameter URL

  try {
    const stocks = await prisma.stock.findMany({
      where: { storeId },
      include: {
        product: true, // Menampilkan produk terkait stok
        store: true, // Menampilkan toko terkait
        stockLogs: true, // Menampilkan log perubahan stok
      },
    });

    res.status(200).json(stocks); // Mengirimkan data stok produk per toko
  } catch (error) {
    console.error('Error fetching stocks:', error);
    next(error);
  }
}

// Fungsi untuk memperbarui stok produk (Admin/Store Admin)
export async function updateStock(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { storeId, productId, quantity, reason } = req.body; // Ambil data dari request body

  try {
    // Pastikan stok yang ada untuk produk dan toko yang bersangkutan
    const stock = await prisma.stock.findFirst({
      where: { productId: productId, storeId: storeId }, // Cek stok berdasarkan productId dan storeId
    });

    if (!stock) {
      res
        .status(404)
        .json({ message: 'Stock not found for this product and store' });
      return;
    }

    // Buat log perubahan stok (menambahkan atau mengurangi stok)
    await prisma.stockLog.create({
      data: {
        stockId: stock.id,
        change: quantity, // Perubahan stok (positif atau negatif)
        reason, // Alasan perubahan stok (misalnya: pembelian, restock)
      },
    });

    // Update jumlah stok produk
    const updatedStock = await prisma.stock.update({
      where: { id: stock.id },
      data: { quantity: stock.quantity + quantity }, // Update stok berdasarkan perubahan
    });

    res.status(200).json(updatedStock); // Mengirimkan data stok yang telah diperbarui
  } catch (error) {
    console.error('Error updating stock:', error);
    next(error);
  }
}

// Fungsi untuk menambahkan stok produk baru (Admin)
export async function createStock(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { storeId, productId, quantity } = req.body;

  try {
    // Cek apakah stok untuk produk dan toko tersebut sudah ada
    const existingStock = await prisma.stock.findFirst({
      where: { productId: productId, storeId: storeId },
    });

    if (existingStock) {
      res
        .status(400)
        .json({ message: 'Stock already exists for this product and store' });
      return;
    }

    // Buat stok baru untuk produk dan toko yang bersangkutan
    const newStock = await prisma.stock.create({
      data: {
        storeId,
        productId,
        quantity,
      },
    });

    res.status(201).json(newStock); // Mengirimkan stok baru yang telah dibuat
  } catch (error) {
    console.error('Error creating stock:', error);
    next(error);
  }
}

// Fungsi untuk menghapus stok produk (Admin)
export async function deleteStock(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { storeId, productId } = req.params; // Ambil storeId dan productId dari URL

  try {
    const stock = await prisma.stock.findFirst({
      where: {
        productId: parseInt(productId),
        storeId: parseInt(storeId),
      },
    });

    if (!stock) {
      res.status(404).json({ message: 'Stock not found' });
      return;
    }

    // Hapus stok produk
    await prisma.stock.delete({
      where: { id: stock.id },
    });

    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    next(error);
  }
}
