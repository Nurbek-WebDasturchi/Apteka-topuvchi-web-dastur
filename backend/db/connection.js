// ── MA'LUMOTLAR BAZASIGA ULANISH ──────────────────────────────
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "aptek_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  ssl: {
    rejectUnauthorized: false, // ← Supabase uchun shart
  },
  family: 4, // ← IPv6 o'rniga IPv4 majburlash
});

// Ulanishni tekshirish
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL ulanish xatosi:", err.message);
  } else {
    console.log("✅ PostgreSQL ga muvaffaqiyatli ulandi");
    release();
  }
});

module.exports = pool;
