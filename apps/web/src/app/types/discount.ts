export interface Discount {
  id: number;
  name: string;
  amount: number;
  isPercentage: boolean;
  minPurchase: number | null;
  maxDiscount: number | null;
  isBuyOneGetOne: boolean;
  createdAt: string;
  updatedAt: string;
}
