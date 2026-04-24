// ════════════════════════════════════════════════════════════
//  APTEK TOPUVCHI — ASOSIY SERVER
//  Ishga tushirish: node server.js
//  Ishlab chiqish: npx nodemon server.js
// ════════════════════════════════════════════════════════════
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ── MIDDLEWARE ────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── YO'LLAR ───────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/pharmacies', require('./routes/pharmacies'));
app.use('/api/medicines',  require('./routes/medicines'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/admin',      require('./routes/admin'));

// ── SALOMLASHUV ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Aptek Topuvchi API ishlamoqda',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/me',
      'GET  /api/pharmacies?lat=&lng=&radius=',
      'GET  /api/medicines?search=',
      'POST /api/orders',
      'GET  /api/orders/my',
      'GET  /api/admin/stats',
    ]
  });
});

// ── SERVERNI ISHGA TUSHIRISH ──────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('==============================================');
  console.log('  APTEK TOPUVCHI SERVER');
  console.log('==============================================');
  console.log('  Manzil: http://localhost:' + PORT);
  console.log('  API:    http://localhost:' + PORT + '/api/...');
  console.log('==============================================');
});
