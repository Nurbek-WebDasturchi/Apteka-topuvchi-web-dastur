const router  = require('express').Router();
const pool    = require('../db/connection');
const isAdmin = require('../middleware/isAdmin');

// Dori qidirish
router.get('/', async (req, res) => {
  const { search, pharmacy_id, in_stock } = req.query;
  try {
    let query = 'SELECT m.*, p.name AS pharmacy_name FROM medicines m JOIN pharmacies p ON m.pharmacy_id = p.id WHERE 1=1';
    const params = [];
    if (search) {
      params.push('%' + search + '%');
      query += ` AND LOWER(m.name) LIKE LOWER($${params.length})`;
    }
    if (pharmacy_id) {
      params.push(pharmacy_id);
      query += ` AND m.pharmacy_id = $${params.length}`;
    }
    if (in_stock === 'true') {
      query += ' AND m.in_stock = true';
    }
    query += ' ORDER BY m.name LIMIT 100';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dori qoshish (admin)
router.post('/', isAdmin, async (req, res) => {
  const { name, description, price, pharmacy_id, in_stock } = req.body;
  if (!name || !pharmacy_id)
    return res.status(400).json({ error: 'nom va pharmacy_id majburiy' });
  const result = await pool.query(
    'INSERT INTO medicines (name, description, price, pharmacy_id, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, description, price, pharmacy_id, in_stock !== false]
  );
  res.json(result.rows[0]);
});

// Dori yangilash (admin)
router.put('/:id', isAdmin, async (req, res) => {
  const { name, description, price, in_stock } = req.body;
  const result = await pool.query(
    'UPDATE medicines SET name=$1, description=$2, price=$3, in_stock=$4 WHERE id=$5 RETURNING *',
    [name, description, price, in_stock, req.params.id]
  );
  res.json(result.rows[0]);
});

// Dori ochirish (admin)
router.delete('/:id', isAdmin, async (req, res) => {
  await pool.query('DELETE FROM medicines WHERE id=$1', [req.params.id]);
  res.json({ message: "Dori o'chirildi" });
});

module.exports = router;
