"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Login failed");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error, try again.");
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-cream)] px-5 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-[28px] border-2 border-[var(--color-ink)] bg-white p-8 shadow-[10px_10px_0_0_var(--color-mango)]"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-ink)] text-[var(--color-mango)]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              JustJuice
            </p>
            <h1
              className="text-3xl leading-none text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Owner sign-in
            </h1>
          </div>
        </div>

        <label className="block">
          <span
            className="mb-1 block text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            required
            className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-3 py-3 text-base outline-none focus:border-[var(--color-mango-deep)]"
          />
        </label>

        {error && (
          <p
            className="mt-3 rounded-lg bg-[var(--color-hibiscus)]/10 px-3 py-2 text-sm text-[var(--color-hibiscus)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm text-[var(--color-cream)] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p
          className="mt-4 text-center text-[11px] text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Private area · for the JustJuice owner only.
        </p>
      </form>
    </main>
  );
}
