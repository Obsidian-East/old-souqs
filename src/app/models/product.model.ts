export interface Product {
  _id?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  stock: number;
  price: number;
  sku: string;
  tag: string[];
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}