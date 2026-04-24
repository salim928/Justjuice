"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "justjuice.cart.v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  setQty: (productId: string, ml: number, qty: number) => void;
  remove: (productId: string, ml: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function keyOf(productId: string, ml: number) {
  return `${productId}::${ml}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem = useCallback<CartContextValue["addItem"]>((incoming) => {
    const qty = incoming.qty ?? 1;
    setItems((prev) => {
      const k = keyOf(incoming.productId, incoming.ml);
      const existing = prev.find(
        (p) => keyOf(p.productId, p.ml) === k
      );
      if (existing) {
        return prev.map((p) =>
          keyOf(p.productId, p.ml) === k
            ? { ...p, qty: p.qty + qty }
            : p
        );
      }
      return [
        ...prev,
        {
          productId: incoming.productId,
          name: incoming.name,
          ml: incoming.ml,
          price: incoming.price,
          qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback<CartContextValue["setQty"]>((productId, ml, qty) => {
    setItems((prev) => {
      if (qty <= 0) {
        return prev.filter(
          (p) => !(p.productId === productId && p.ml === ml)
        );
      }
      return prev.map((p) =>
        p.productId === productId && p.ml === ml ? { ...p, qty } : p
      );
    });
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((productId, ml) => {
    setItems((prev) =>
      prev.filter((p) => !(p.productId === productId && p.ml === ml))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const it of items) {
      c += it.qty;
      s += it.qty * it.price;
    }
    return { count: c, subtotal: s };
  }, [items]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    addItem,
    setQty,
    remove,
    clear,
    open,
    close,
    toggle,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
