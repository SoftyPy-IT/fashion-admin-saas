export interface IBrand {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string; // Assuming image URL is a string
  products: string[]; // Assuming these are product IDs
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICategory {
  _id: string;
  category_code: string;
  name: string;
  description: string;
  image: string; // Assuming image URL is a string
  slug: string;
  parent_category: string | null;
  products: string[]; // Assuming these are product IDs
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUnit {
  _id: string;
  unit_code: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IVariant {
  name: string;
  values: string[];
  _id: string;
}

export interface IFaq {
  question: string;
  answer: string;
  _id: string;
}

export interface IProduct {
  _id: string;
  name: string;
  code: string;
  slug: string;
  barcodeSymbology: string;
  brand: IBrand;
  category: ICategory;
  productUnit: IUnit;
  defaultSaleUnit: IUnit;
  defaultPurchaseUnit: IUnit;
  productCost: number;
  price: number;
  taxMethod: string;
  description: string;
  short_description: string;
  thumbnail: string; // Assuming thumbnail URL is a string
  images: string[]; // Assuming image URLs are strings
  discount_price: number;
  tags: string[];
  stock: number;
  is_stockout: boolean;
  quantity: number;
  is_available: boolean;
  is_featured: boolean;
  is_active: boolean;
  total_sale: number;
  rating: number;
  faq: IFaq[];
  variants: IVariant[];
  hasVariants: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProductResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: IProduct[];
}
