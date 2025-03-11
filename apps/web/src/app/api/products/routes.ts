// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { Product } from '../../types/products';

let products: Product[] = [];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const data: Product = await request.json();
  products.push(data);
  return NextResponse.json({ message: 'Product created' }, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, ...data }: { id: string } & Partial<Product> =
    await request.json();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...data };
    return NextResponse.json({ message: 'Product updated' });
  }
  return NextResponse.json({ message: 'Product not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id }: { id: string } = await request.json();
  products = products.filter((p) => p.id !== id);
  return NextResponse.json({ message: 'Product deleted' });
}
