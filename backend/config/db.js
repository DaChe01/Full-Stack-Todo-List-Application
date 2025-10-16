import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// Use DATABASE_URL if defined (Render / Supabase), otherwise fallback to separate local vars
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required for Supabase / Render
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      }
);

// Optional: log connection status
pool.connect((err, client, release) => {
  if (err) console.error("❌ PostgreSQL connection error:", err.stack);
  else {
    console.log("✅ Connected to PostgreSQL successfully");
    release();
  }
});

export default pool;
