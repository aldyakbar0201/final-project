// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  category: string;
  categoryId?: number;
  store?: string;
  storeId?: number;
  isOutOfStock: boolean;
  stocks?: StockInfo[];
}

export interface AdminProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  storeId: number;
  Category?: {
    id: number;
    name: string;
  };
  Store?: {
    id: number;
    name: string;
  };
  ProductImage?: {
    id: number;
    imageUrl: string;
  }[];
}

export interface StockInfo {
  storeId: number;
  storeName: string;
  quantity: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  products?: AdminProduct[];
}

// Store Types
export interface Store {
  id: number;
  name: string;
}

// Cart Types
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  userId: number;
  totalPrice: number;
  items: CartItem[];
}
