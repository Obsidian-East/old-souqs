export interface Product {
  _id?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  stock: number;
  price: number;
  sku: string;
  tag: string[]; // This should match your Go backend field
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}