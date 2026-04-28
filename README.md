# 🏥 Aptek Topuvchi — To'liq Loyiha

## Loyiha tuzilmasi

```
aptek_full/
├── backend/              ← Node.js + Express server
│   ├── server.js         ← Asosiy server fayli
│   ├── package.json      ← Dependencies
│   ├── .env.example      ← Config namunasi
│   ├── db/
│   │   ├── connection.js ← PostgreSQL ulanish
│   │   └── schema.sql    ← Jadvallar + namuna data
│   ├── middleware/
│   │   ├── auth.js       ← JWT tekshirish
│   │   └── isAdmin.js    ← Admin tekshirish
│   └── routes/
│       ├── auth.js       ← Register, Login, Me
│       ├── pharmacies.js ← CRUD + joylashuv bo'yicha qidiruv
│       ├── medicines.js  ← CRUD + nom bo'yicha qidiruv
│       ├── orders.js     ← Buyurtmalar
│       └── admin.js      ← Statistika
│
└── frontend/             ← Vanilla HTML/CSS/JS
    ├── index.html        ← Xarita sahifasi (o'z API bilan)
    ├── css/style.css     ← Umumiy stillar
    ├── js/api.js         ← API helper (fetch + auth)
    └── pages/
        ├── login.html    ← Kirish
        ├── register.html ← Ro'yxatdan o'tish
        ├── search.html   ← Dori qidirish + buyurtma
        ├── profile.html  ← Foydalanuvchi profili
        └── admin/
            ├── dashboard.html   ← Statistika
            ├── pharmacies.html  ← Dorixonalar boshqaruv
            └── orders.html      ← Buyurtmalar boshqaruv

```

---

## O'rnatish qadamlari

### 1. PostgreSQL o'rnatish

```bash
# Ubuntu/Debian:
sudo apt install postgresql

# Mac (Homebrew):
brew install postgresql
brew services start postgresql

# Windows: https://www.postgresql.org/download/windows/
```

### 2. Ma'lumotlar bazasini yaratish

```bash
# PostgreSQL ga kirish:
psql -U postgres

# Bazani yaratish:
CREATE DATABASE aptek_db;
\q

# Sxemani yuklash:
psql -U postgres -d aptek_db -f backend/db/schema.sql
```

### 3. Backend sozlash

```bash
cd backend
npm install
cp .env.example .env
# .env faylni oching va parollarni kiriting!
nano .env
```

`.env` fayl tarkibi:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aptek_db
DB_USER=postgres
DB_PASSWORD=SIZNING_PAROLINGIZ
JWT_SECRET=uzun_maxfiy_kalit_bu_yerda
1=5000
```

### 4. Serverni ishga tushirish

```bash
cd backend
node server.js
```

Terminal: `✅ PostgreSQL ga muvaffaqiyatli ulandi` ko'rsatilsa — tayyor!

### 5. Frontend ochish

```bash
cd frontend
# Oddiy usul (Python bilan):
python3 -m http.server 3000
# Keyin brauzerni oching: http://localhost:3000
```

---

## Sinash

### Admin kirish:

- Email: `admin@aptek.uz`
- Parol: `password`

### API so'rovlari:

```bash
# Barcha dorixonalar:
curl http://localhost:5000/api/pharmacies

# Yaqin dorixonalar (Toshkent):
curl "http://localhost:5000/api/pharmacies?lat=41.3&lng=69.28&radius=5000"

# Dori qidirish:
curl "http://localhost:5000/api/medicines?search=paracetamol"

# Ro'yxatdan o'tish:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@test.uz","password":"123456"}'
```

---

## API Endpointlar

| Method | URL                       | Tavsif               | Auth  |
| ------ | ------------------------- | -------------------- | ----- |
| POST   | /api/auth/register        | Ro'yxatdan o'tish    | Yo'q  |
| POST   | /api/auth/login           | Kirish               | Yo'q  |
| GET    | /api/auth/me              | Profil               | Token |
| GET    | /api/pharmacies           | Barcha dorixonalar   | Yo'q  |
| GET    | /api/pharmacies?lat=&lng= | Yaqin dorixonalar    | Yo'q  |
| POST   | /api/pharmacies           | Dorixona qo'shish    | Admin |
| PUT    | /api/pharmacies/:id       | Tahrirlash           | Admin |
| DELETE | /api/pharmacies/:id       | O'chirish            | Admin |
| GET    | /api/medicines            | Barcha dorilar       | Yo'q  |
| GET    | /api/medicines?search=    | Qidirish             | Yo'q  |
| POST   | /api/medicines            | Dori qo'shish        | Admin |
| POST   | /api/orders               | Buyurtma berish      | Token |
| GET    | /api/orders/my            | Mening buyurtmalarim | Token |
| GET    | /api/orders               | Barcha buyurtmalar   | Admin |
| PUT    | /api/orders/:id/status    | Status yangilash     | Admin |
| GET    | /api/admin/stats          | Statistika           | Admin |
