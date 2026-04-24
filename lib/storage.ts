import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Storage adapter for JSON-shaped data.
 *
 * Production (Vercel, any host with `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`):
 *   reads/writes a single JSON-stringified value per key in Upstash Redis.
 *
 * Local dev (no env vars set):
 *   reads/writes `data/<key>.json` on disk.
 *
 * On first read in production the bundled `data/<key>.json` file seeds Redis
 * so deployments start with the last-committed catalog/orders state.
 */

const DATA_DIR = path.join(process.cwd(), "data");

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  // Accept either the Upstash-style vars or the Vercel KV-style vars
  // (the Vercel Upstash Marketplace integration uses the latter by default).
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

async function readSeed<T>(key: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function readFromDisk<T>(key: string, fallback: T): Promise<T> {
  const seed = await readSeed<T>(key);
  return seed ?? fallback;
}

async function writeToDisk<T>(key: string, value: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, `${key}.json`),
    JSON.stringify(value, null, 2),
    "utf-8"
  );
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const client = getRedis();
  if (!client) {
    return readFromDisk<T>(key, fallback);
  }
  const stored = await client.get<T>(key);
  if (stored !== null && stored !== undefined) {
    return stored;
  }
  const seed = await readSeed<T>(key);
  const initial = seed ?? fallback;
  await client.set(key, initial);
  return initial;
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  const client = getRedis();
  if (!client) {
    await writeToDisk(key, value);
    return;
  }
  await client.set(key, value);
}

export function storageBackend(): "redis" | "fs" {
  return getRedis() ? "redis" : "fs";
}
