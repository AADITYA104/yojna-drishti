import pg from "pg";

const { Pool } = pg;

// FIX C-07: Lazy initialization — do NOT throw at import time.
// Only create the pool when getPool() is first called.
// This prevents server crashes when DATABASE_URL is not set
// on pages/routes that don't need the database.
let _pool = null;

export function getPool() {
  if (_pool) return _pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Set it in .env before using database features."
    );
  }
  _pool = new Pool({ connectionString, max: 3, connectionTimeoutMillis: 5000 });
  return _pool;
}

// Keep named export for backward compat — but now lazily resolved.
export const pool = new Proxy(
  {},
  {
    get(_target, prop) {
      return getPool()[prop];
    },
  }
);
