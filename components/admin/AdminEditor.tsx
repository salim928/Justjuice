"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import type { Catalog, Product } from "@/lib/types";
import { CURRENCY } from "@/lib/config";

type Draft = Product[];

function cloneProducts(products: Product[]): Draft {
  return products.map((p) => ({
    ...p,
    tags: [...p.tags],
    sizes: p.sizes.map((s) => ({ ...s })),
  }));
}

export default function AdminEditor({
  initialCatalog,
}: {
  initialCatalog: Catalog;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() =>
    cloneProducts(initialCatalog.products)
  );
  const [savedAt, setSavedAt] = useState(initialCatalog.updatedAt);
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "saving" }
    | { kind: "saved" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const mutateProduct = (id: string, patch: Partial<Product>) => {
    setDraft((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  const mutateSize = (
    productId: string,
    idx: number,
    patch: Partial<Product["sizes"][number]>
  ) => {
    setDraft((prev) =>
      prev.map((p) =>
        p.id !== productId
          ? p
          : {
              ...p,
              sizes: p.sizes.map((s, i) =>
                i === idx ? { ...s, ...patch } : s
              ),
            }
      )
    );
  };

  const addSize = (productId: string) => {
    setDraft((prev) =>
      prev.map((p) =>
        p.id !== productId
          ? p
          : {
              ...p,
              sizes: [
                ...p.sizes,
                { ml: 0, price: 0, inStock: true },
              ],
            }
      )
    );
  };

  const removeSize = (productId: string, idx: number) => {
    setDraft((prev) =>
      prev.map((p) =>
        p.id !== productId
          ? p
          : { ...p, sizes: p.sizes.filter((_, i) => i !== idx) }
      )
    );
  };

  const reset = () => {
    setDraft(cloneProducts(initialCatalog.products));
    setStatus({ kind: "idle" });
  };

  const save = async () => {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: draft }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus({
          kind: "error",
          message: body?.error ?? "Save failed",
        });
        return;
      }
      const catalog = (await res.json()) as Catalog;
      setSavedAt(catalog.updatedAt);
      setDraft(cloneProducts(catalog.products));
      setStatus({ kind: "saved" });
      router.refresh();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[var(--color-cream)] pb-24">
      <header className="sticky top-0 z-10 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream)]/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              JustJuice · Owner
            </p>
            <h1
              className="text-2xl leading-none md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Product & Stock
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border-2 border-[var(--color-ink)] px-4 py-2 text-xs"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-ink)] bg-white px-3 py-2 text-xs"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">
        <p
          className="mb-6 text-sm text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Last saved: {new Date(savedAt).toLocaleString()}
        </p>

        <div className="space-y-6">
          {draft.map((product) => (
            <article
              key={product.id}
              className="rounded-[24px] border-2 border-[var(--color-ink)] bg-white p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {product.category}
                  </p>
                  <h2
                    className="text-3xl leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {product.name}
                  </h2>
                </div>

                <label
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-3 py-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  <input
                    type="checkbox"
                    checked={product.available}
                    onChange={(e) =>
                      mutateProduct(product.id, {
                        available: e.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-[var(--color-leaf-deep)]"
                  />
                  <span className="text-xs uppercase tracking-wider">
                    {product.available ? "Available" : "Sold out today"}
                  </span>
                </label>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-ink)]/20">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--color-cream-deep)] text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
                    <tr>
                      <th className="px-3 py-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                        Size (ml)
                      </th>
                      <th className="px-3 py-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                        Price ({CURRENCY})
                      </th>
                      <th className="px-3 py-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                        In stock
                      </th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: "var(--font-jakarta)" }}>
                    {product.sizes.map((size, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-[var(--color-ink)]/10"
                      >
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            step={50}
                            value={size.ml}
                            onChange={(e) =>
                              mutateSize(product.id, idx, {
                                ml: Number(e.target.value),
                              })
                            }
                            className="w-24 rounded-md border border-[var(--color-ink)]/30 bg-white px-2 py-1.5 text-sm outline-none focus:border-[var(--color-mango-deep)]"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            step="0.5"
                            value={size.price}
                            onChange={(e) =>
                              mutateSize(product.id, idx, {
                                price: Number(e.target.value),
                              })
                            }
                            className="w-24 rounded-md border border-[var(--color-ink)]/30 bg-white px-2 py-1.5 text-sm outline-none focus:border-[var(--color-mango-deep)]"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <label className="inline-flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={size.inStock}
                              onChange={(e) =>
                                mutateSize(product.id, idx, {
                                  inStock: e.target.checked,
                                })
                              }
                              className="h-4 w-4 accent-[var(--color-leaf-deep)]"
                            />
                            <span className="text-xs">
                              {size.inStock ? "Yes" : "No"}
                            </span>
                          </label>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeSize(product.id, idx)}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ink)]/20 px-2 py-1 text-[11px] text-[var(--color-ink-soft)] hover:border-[var(--color-hibiscus)] hover:text-[var(--color-hibiscus)]"
                            aria-label="Remove size"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => addSize(product.id)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-[var(--color-ink)]/40 px-3 py-1.5 text-xs text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <Plus className="h-3 w-3" />
                Add size
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 w-[min(calc(100vw-1.5rem),640px)] -translate-x-1/2 rounded-full border-2 border-[var(--color-ink)] bg-white px-4 py-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-3">
          <p
            className="min-w-0 flex-1 truncate text-xs text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {status.kind === "saving" && "Saving…"}
            {status.kind === "saved" && "Saved · changes are live on the site"}
            {status.kind === "error" && `Error: ${status.message}`}
            {status.kind === "idle" &&
              "Edit anything above, then save to push it live."}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-ink)] px-3 py-2 text-xs"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Discard
            </button>
            <button
              type="button"
              onClick={save}
              disabled={status.kind === "saving"}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs text-[var(--color-mango)] transition-transform hover:scale-[1.03] disabled:opacity-50"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <Save className="h-3.5 w-3.5" />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
