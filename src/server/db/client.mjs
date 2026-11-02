import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DATABASE_URL before running database commands.");

export const pool = new Pool({ connectionString, max: 3, connectionTimeoutMillis: 5000 });
