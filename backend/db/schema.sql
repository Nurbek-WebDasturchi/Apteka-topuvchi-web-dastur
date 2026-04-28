-- ════════════════════════════════════════════════════════════
--  APTEK TOPUVCHI — DATABASE SXEMASI
-- ════════════════════════════════════════════════════════════

-- Eski jadvallarni o'chirish (agar mavjud bo'lsa)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS pharmacies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ── FOYDALANUVCHILAR ─────────────────────────────────────────
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   TEXT                NOT NULL,
  role       VARCHAR(20)         DEFAULT 'user',  -- 'user' yoki 'admin'
  created_at TIMESTAMP           DEFAULT NOW()
);
-- ── DORIXONALAR ──────────────────────────────────────────────
CREATE TABLE pharmacies (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200)  NOT NULL,
  address       TEXT,
  lat           DECIMAL(10,8) NOT NULL,
  lng           DECIMAL(11,8) NOT NULL,
  phone         VARCHAR(30),
  working_hours VARCHAR(150),
  is_active     BOOLEAN       DEFAULT true,
  created_at    TIMESTAMP     DEFAULT NOW()
);

-- ── DORILAR ──────────────────────────────────────────────────
CREATE TABLE medicines (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200)   NOT NULL,
  description  TEXT,
  price        DECIMAL(12, 2) NOT NULL DEFAULT 0,
  pharmacy_id  INT            REFERENCES pharmacies(id) ON DELETE CASCADE,
  in_stock     BOOLEAN        DEFAULT true,
  created_at   TIMESTAMP      DEFAULT NOW()
);

-- ── BUYURTMALAR ──────────────────────────────────────────────
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     INT         REFERENCES users(id)      ON DELETE SET NULL,
  medicine_id INT         REFERENCES medicines(id)  ON DELETE SET NULL,
  pharmacy_id INT         REFERENCES pharmacies(id) ON DELETE SET NULL,
  quantity    INT         DEFAULT 1,
  total_price DECIMAL(12,2),
  status      VARCHAR(50) DEFAULT 'pending',  -- pending | confirmed | ready | cancelled
  note        TEXT,
  created_at  TIMESTAMP   DEFAULT NOW()
);

-- ── INDEKSLAR (tezlashtirish uchun) ──────────────────────────
CREATE INDEX idx_pharmacies_location ON pharmacies(lat, lng);
CREATE INDEX idx_medicines_pharmacy  ON medicines(pharmacy_id);
CREATE INDEX idx_orders_user         ON orders(user_id);
CREATE INDEX idx_orders_status       ON orders(status);

-- ── NAMUNA MA'LUMOTLAR ───────────────────────────────────────
-- Admin foydalanuvchi (parol: admin123)
INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@aptek.uz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Toshkentdagi dorixonalar
INSERT INTO pharmacies (name, address, lat, lng, phone, working_hours) VALUES
  ('Shifobaxsh Dorixona',    'Yunusobod 19-kvartal',   41.3424, 69.2845, '+998901234567', '08:00-22:00'),
  ('Oq Dorixona',            'Chilonzor 9-kvartal',    41.2995, 69.2401, '+998902345678', '09:00-21:00'),
  ('Salomatlik Dorixona',    'Mirzo Ulugbek 34-uy',    41.3187, 69.2956, '+998903456789', '24 soat'),
  ('Baraka Apteka',          'Shayxontohur, Navoiy ko', 41.3001, 69.2701, '+998904567890', '08:00-20:00'),
  ('Dori Darmon',            'Sergeli 19-mavze',        41.2256, 69.2612, '+998905678901', '09:00-22:00');

-- Namuna dorilar
INSERT INTO medicines (name, description, price, pharmacy_id, in_stock) VALUES
  ('Paracetamol 500mg', 'Isitma va og''riqqa qarshi', 3500,  1, true),
  ('Ibuprofen 400mg',   'Yallig''lanishga qarshi',     5200,  1, true),
  ('Amoxicillin 500mg', 'Antibiotik',                  12000, 2, true),
  ('Vitamin C 1000mg',  'Immunitetni kuchaytiradi',    8000,  2, true),
  ('No-spa 40mg',       'Spazm og''riqlariga qarshi',  4500,  3, true),
  ('Mezim forte',       'Hazm uchun',                  9500,  3, true),
  ('Validol',           'Yurak og''rig''i uchun',      2800,  4, true),
  ('Aspirin 100mg',     'Qon suyultiruvchi',            3200,  4, true),
  ('Xlorofillip',       'Tomog''ga antiseptik',         6700,  5, true),
  ('Panthenol krem',    'Teri uchun',                   11000, 5, true);

-- ── STATISTIKA UCHUN VIEW ────────────────────────────────────
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM users     WHERE role = 'user')  AS total_users,
  (SELECT COUNT(*) FROM pharmacies WHERE is_active = true) AS total_pharmacies,
  (SELECT COUNT(*) FROM medicines  WHERE in_stock = true)  AS total_medicines,
  (SELECT COUNT(*) FROM orders)                            AS total_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending')   AS pending_orders,
  (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE status != 'cancelled') AS total_revenue;
