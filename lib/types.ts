export type Flavor =
  | "mango"
  | "pineapple-ginger"
  | "pineapple-beet"
  | "tigernut"
  | "sobolo";

export type Size = {
  ml: number;
  price: number;
  inStock: boolean;
};

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  flavor: Flavor;
  photo: string | null;
  bg: string;
  text: string;
  accent: string;
  category: string;
  available: boolean;
  sizes: Size[];
};

export type Catalog = {
  products: Product[];
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  ml: number;
  price: number;
  qty: number;
};
