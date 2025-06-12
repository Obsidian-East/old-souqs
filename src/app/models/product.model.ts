export interface Product {
  _id?: string;
  title: string;
  description: string;
  price: number;
  sku: string;
  tag: string[]; // This should match your Go backend field
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}