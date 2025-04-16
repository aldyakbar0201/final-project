export interface CartItems {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  Product: {
    id: number;
    name: string;
    price: number;
    description: string;
    Store: { name: string };
    ProductImage: { imageUrl: string }[];
  };
  createdAt: string;
  updatedAt: Date;
}
