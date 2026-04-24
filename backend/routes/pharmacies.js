const router  = require('express').Router();
const pool    = require('../db/connection');
const isAdmin = require('../middleware/isAdmin');

// Barcha dorixonalar (joylashuv bo'yicha saralash)
router.get('/', async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;
  try {
    let rows;
    if (lat && lng) {
      // Masofani hisoblab, yaqinlarini qaytarish
      const result = await pool.query(`
        SELECT *,
          ROUND(
            6371000 * ACOS(
              COS(RADIANS($1)) * COS(RADIANS(lat)) *
              COS(RADIANS(lng) - RADIANS($2)) +
              SIN(RADIANS($1)) * SIN(RADIANS(lat))
            )
          ) AS distance_m
        FROM pharmacies
        WHERE is_active = true
          AND 6371000 * ACOS(
              COS(RADIANS($1)) * COS(RADIANS(lat)) *
              COS(RADIANS(lng) - RADIANS($2)) +
              SIN(RADIANS($1)) * SIN(RADIANS(lat))
            ) <= $3
        ORDER BY distance_m
        LIMIT 60
      `, [lat, lng, radius]);
      rows = result.rows;
    } else {
      const result = await pool.query(
        'SELECT * FROM pharmacies WHERE is_active=true ORDER BY name'
      );
      rows = result.rows;
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bitta dorixona
router.get('/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM pharmacies WHERE id=$1', [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: 'Topilmadi' });
  res.json(result.rows[0]);
});

// Dorixona qoshish (admin)
router.post('/', isAdmin, async (req, res) => {
  const { name, address, lat, lng, phone, working_hours } = req.body;
  if (!name || !lat || !lng)
    return res.status(400).json({ error: 'nom, lat, lng majburiy' });
  const result = await pool.query(
    'INSERT INTO pharmacies (name, address, lat, lng, phone, working_hours) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, address, lat, lng, phone, working_hours]
  );
  res.json(result.rows[0]);
});

// Dorixona tahrirlash (admin)
router.put('/:id', isAdmin, async (req, res) => {
  const { name, address, lat, lng, phone, working_hours, is_active } = req.body;
  const result = await pool.query(
    'UPDATE pharmacies SET name=$1, address=$2, lat=$3, lng=$4, phone=$5, working_hours=$6, is_active=$7 WHERE id=$8 RETURNING *',
    [name, address, lat, lng, phone, working_hours, is_active, req.params.id]
  );
  res.json(result.rows[0]);
});

// Dorixona ochirish (admin)
router.delete('/:id', isAdmin, async (req, res) => {
  await pool.query('UPDATE pharmacies SET is_active=false WHERE id=$1', [req.params.id]);
  res.json({ message: "Dorixona o'chirildi" });
});

module.exports = router;
