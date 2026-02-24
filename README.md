# 🪑 Chair Factory – Production-Ready Website

A full-stack, production-ready Chair Factory website with a public catalog, order request system, and a secure admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Zustand, React Router v6, Framer-motion |
| Backend | Node.js + Express, JWT Auth, Multer, Rate Limiting, Helmet |
| Database | PostgreSQL + Prisma ORM |
| DevOps | Docker + Docker Compose |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL running locally **or** Docker

### Option A: With Docker (Easiest)

```bash
# Start everything (postgres + server + client build)
docker-compose up --build
```

Visit: `http://localhost` (client) and `http://localhost:5000/api/health` (server)

---

### Option B: Manual Setup

#### 1. Install dependencies

```bash
# From project root
npm install          # installs concurrently
cd server && npm install
cd ../client && npm install
```

#### 2. Configure environment

```bash
# server/.env is pre-configured for local postgres
# Edit server/.env if your postgres settings differ
```

#### 3. Set up database

```bash
cd server
npx prisma migrate dev --name init
npm run db:seed
```

#### 4. Run both servers

```bash
# From project root
cd server && npm run dev     # Terminal 1  →  http://localhost:5000
cd client && npm run dev     # Terminal 2  →  http://localhost:5173
```

---

## 🔑 Admin Access

| Field | Default Value |
|---|---|
| URL | `http://localhost:5173/admin/login` |
| Email | `admin@chairfactory.com` |
| Password | `Admin@1234` |

> **Change the password** after first login by updating `ADMIN_PASSWORD` in `server/.env` and re-running the seed.

---

## 📁 Project Structure

```
chair-factory/
├── client/                  # React + Vite Frontend
│   └── src/
│       ├── components/
│       │   ├── layout/      # Header, Footer
│       │   ├── public/      # ProductCard
│       │   ├── admin/       # AdminLayout
│       │   └── ui/          # LoadingSpinner
│       ├── pages/
│       │   ├── public/      # Home, Products, ProductDetail, About, BulkOrders, Contact
│       │   └── admin/       # AdminLogin, AdminDashboard, AdminProducts, AdminOrders, AdminContent, AdminThemes
│       ├── store/           # Zustand stores (auth, theme)
│       ├── services/        # Axios API layer
│       └── index.css        # 5 CSS themes (light/dark/industrial/wood/modern)
├── server/                  # Express Backend
│   ├── src/
│   │   ├── controllers/     # authController, productController, orderController, contentController
│   │   ├── routes/          # auth, products, orders, content, themes, upload
│   │   ├── middlewares/     # auth (JWT)
│   │   ├── seed.js          # Database seed (12 products + admin + content)
│   │   ├── app.js           # Express setup
│   │   └── server.js        # Entry point
│   └── prisma/
│       └── schema.prisma    # DB models: Admin, Product, OrderRequest, SiteContent, ThemeConfig
├── uploads/                 # Uploaded product images
├── docker-compose.yml
└── README.md
```

---

## 🎨 Theme System

5 built-in themes switchable from the top-right toggle or admin panel:

| Theme | Style |
|---|---|
| ☀️ Light | Clean white, warm amber |
| 🌙 Dark | Deep dark, golden highlights |
| ⚙️ Industrial | Charcoal + bold orange |
| 🪵 Natural Wood | Warm wood tones |
| 💎 Modern Minimal | Cool blues + minimal |

Themes use **CSS custom properties** — fully themeable without JavaScript.

---

## 🌐 API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (filter: category, material, search, featured) |
| GET | `/api/products/:slug` | Single product |
| POST | `/api/orders` | Submit order request |
| GET | `/api/content` | Get all site content |
| GET | `/api/themes` | Get current theme config |
| GET | `/api/health` | Health check |

### Admin (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/stats` | Dashboard stats |
| PUT | `/api/orders/:id/status` | Update order status |
| PUT | `/api/content/:key` | Update site content |
| PUT | `/api/themes` | Set default theme |
| POST | `/api/upload` | Upload images |

---

## 🚢 Deployment

### Render.com

1. Push to GitHub
2. Create a **PostgreSQL** service on Render
3. Deploy **server/** as a Web Service (Node.js), set env vars from `.env`
4. Deploy **client/** as a Static Site, build command: `npm run build`, publish dir: `dist`
5. Set `VITE_API_URL` in client env to your server URL

### DigitalOcean / AWS

Use the provided `docker-compose.yml` on any VM with Docker installed.

---

## 📝 License

MIT — free to use for commercial projects.
