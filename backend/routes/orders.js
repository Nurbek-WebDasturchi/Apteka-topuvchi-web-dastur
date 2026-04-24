const router = require('express').Router();
const pool   = require('../db/connection');
const auth   = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Buyurtma berish (login talab)
router.post('/', auth, async (req, res) => {
  const { medicine_id, pharmacy_id, quantity = 1, note } = req.body;
  if (!medicine_id || !pharmacy_id)
    return res.status(400).json({ error: 'medicine_id va pharmacy_id majburiy' });
  try {
    const med = await pool.query('SELECT price FROM medicines WHERE id=$1', [medicine_id]);
    if (!med.rows.length) return res.status(404).json({ error: 'Dori topilmadi' });
    const total = med.rows[0].price * quantity;
    const result = await pool.query(
      'INSERT INTO orders (user_id, medicine_id, pharmacy_id, quantity, total_price, note) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, medicine_id, pharmacy_id, quantity, total, note]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mening buyurtmalarim
router.get('/my', auth, async (req, res) => {
  const result = await pool.query(`
    SELECT o.*, m.name AS medicine_name, p.name AS pharmacy_name
    FROM orders o
    JOIN medicines m ON o.medicine_id = m.id
    JOIN pharmacies p ON o.pharmacy_id = p.id
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
  `, [req.user.id]);
  res.json(result.rows);
});

// Barcha buyurtmalar (admin)
router.get('/', isAdmin, async (req, res) => {
  const result = await pool.query(`
    SELECT o.*, u.name AS user_name, u.email,
           m.name AS medicine_name, p.name AS pharmacy_name
    FROM orders o
    LEFT JOIN users u      ON o.user_id     = u.id
    LEFT JOIN medicines m  ON o.medicine_id = m.id
    LEFT JOIN pharmacies p ON o.pharmacy_id = p.id
    ORDER BY o.created_at DESC
    LIMIT 200
  `);
  res.json(result.rows);
});

// Status yangilash (admin)
router.put('/:id/status', isAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'ready', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ error: 'Notogri status' });
  const result = await pool.query(
    'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]
  );
  res.json(result.rows[0]);
});

module.exports = router;
