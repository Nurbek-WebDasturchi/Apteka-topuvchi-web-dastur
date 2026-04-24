const router  = require('express').Router();
const pool    = require('../db/connection');
const isAdmin = require('../middleware/isAdmin');

// Bosh sahifa statistikasi
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dashboard_stats');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Barcha foydalanuvchilar
router.get('/users', isAdmin, async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

module.exports = router;
