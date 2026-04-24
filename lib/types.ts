export type Flavor =
  | "mango"
  | "pineapple-ginger"
  | "pineapple-beet"
  | "tigernut"
  | "sobolo";

export type Size = {
  ml: number;
  price: number;
  qty: number;
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

export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";

export type OrderSource = "whatsapp" | "email" | "web";

export type OrderItem = {
  productId: string;
  name: string;
  ml: number;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  source: OrderSource;
  customer: {
    name: string;
    area: string;
    notes: string;
  };
  items: OrderItem[];
  subtotal: number;
};

export type OrderStore = {
  orders: Order[];
  updatedAt: string;
};
