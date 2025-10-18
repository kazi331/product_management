export interface Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}
