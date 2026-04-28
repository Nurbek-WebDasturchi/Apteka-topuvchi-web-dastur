const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL ulanish xatosi:", err.message);
  } else {
    console.log("✅ PostgreSQL ga muvaffaqiyatli ulandi");
    release();
  }
});

module.exports = pool;
