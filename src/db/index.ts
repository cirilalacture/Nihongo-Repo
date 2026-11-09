import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { env } from 'cloudflare:workers';

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

export function getD1(): D1Database | null {
  try {
    // @ts-ignore
    return (env as any)?.DB || null;
  } catch (err) {
    return null;
  }
}

export function getDb(d1?: D1Database | null) {
  const targetD1 = d1 || getD1();
  if (!targetD1) return null;
  return drizzle(targetD1, { schema });
}

export * from './schema';
