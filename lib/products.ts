import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Catalog, Product } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

export async function readCatalog(): Promise<Catalog> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Catalog;
}

export async function writeCatalog(products: Product[]): Promise<Catalog> {
  const catalog: Catalog = {
    products,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(DATA_PATH, JSON.stringify(catalog, null, 2), "utf-8");
  return catalog;
}

export function sanitizeProducts(input: unknown): Product[] {
  if (!Array.isArray(input)) throw new Error("products must be an array");
  return input.map((p, idx) => {
    if (typeof p !== "object" || p === null) {
      throw new Error(`product at index ${idx} is not an object`);
    }
    const obj = p as Record<string, unknown>;
    const sizes = obj.sizes;
    if (!Array.isArray(sizes) || sizes.length === 0) {
      throw new Error(`product ${idx} missing sizes`);
    }
    return {
      id: String(obj.id),
      name: String(obj.name),
      subtitle: String(obj.subtitle ?? ""),
      description: String(obj.description ?? ""),
      tags: Array.isArray(obj.tags) ? obj.tags.map(String) : [],
      flavor: String(obj.flavor) as Product["flavor"],
      photo: obj.photo == null ? null : String(obj.photo),
      bg: String(obj.bg ?? "var(--color-cream)"),
      text: String(obj.text ?? "var(--color-ink)"),
      accent: String(obj.accent ?? obj.bg ?? "var(--color-mango)"),
      category: String(obj.category ?? obj.name ?? ""),
      available: Boolean(obj.available),
      sizes: sizes.map((s, sIdx) => {
        if (typeof s !== "object" || s === null) {
          throw new Error(`product ${idx} size ${sIdx} not an object`);
        }
        const so = s as Record<string, unknown>;
        const ml = Number(so.ml);
        const price = Number(so.price);
        if (!Number.isFinite(ml) || ml <= 0) {
          throw new Error(`product ${idx} size ${sIdx}: invalid ml`);
        }
        if (!Number.isFinite(price) || price < 0) {
          throw new Error(`product ${idx} size ${sIdx}: invalid price`);
        }
        return { ml, price, inStock: Boolean(so.inStock) };
      }),
    };
  });
}
