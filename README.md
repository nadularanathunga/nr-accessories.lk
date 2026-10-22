# nr-accessories.lk — Smartphone Accessories E-Commerce Platform

A production-ready full-stack E-Commerce platform for mobile phone accessories in Sri Lanka, built with the **MERN** stack (MongoDB, Express, React 18, Node.js), styled with **Tailwind CSS**, and integrated with **PayHere Sandbox Payment Gateway**.

Developed as part of **ICT2142 E-Business Systems** (Student Registration: `TG/2024/2147`).

---

## 🚀 Key Features

* **Storefront & Catalog:** Dynamic product catalog with real-time search, category filtering, responsive filters, and stock indicators.
* **Shopping Cart & Checkout:** Persistent shopping cart powered by React Context and `localStorage` caching, quantity steppers with boundary validation, and real-time subtotal calculation.
* **Form Usability & Real-Time Validation:** Standardized 48px inputs with bold top labels ($\ge 16\text{px}$), friendly helper alerts, and instant visual green checkmarks ($\checkmark$) validating user input immediately.
* **Mobile-First Responsive Design:** Fully audited down to 375px viewports (iPhone SE / 12) with zero sideways scrolling, a collapsible hamburger drawer menu, and finger-friendly ($\ge 44\text{px}$) touch targets.
* **Payment Gateway Integration:** Integrated with PayHere Sandbox with strict `.toFixed(2)` decimal precision and MD5 hash generation on the backend.
* **Authentication & Role-Based Access Control:** JWT authentication with bcrypt password hashing, customer profile management, and protected Admin dashboard routes.
* **Admin Management Suite:** Dashboard with inventory statistics, product CRUD management, and order fulfillment workflows.

---

## 📁 Repository Structure

```text
nr-accessories-lk/
├── document/                      # Academic practical reports, wireframes & ER diagrams
│   ├── evidence/                  # High-resolution QA test evidence screenshots
│   ├── tg2147_ict2142_w1_report.docx
│   │   ...
│   └── tg2147_ict2142_w9_report.docx  # Week 09 QA & Project Diary Report
├── frontend/                      # React frontend application (Vite + Tailwind CSS)
│   ├── public/                    # Static public assets
│   ├── src/
│   │   ├── components/            # Reusable UI components & layouts
│   │   │   ├── Admin/             # Admin management modals and tables
│   │   │   ├── context/           # AuthContext & CartContext (State Management)
│   │   │   ├── ui/                # Base button and design system primitives
│   │   │   ├── SiteHeader.tsx     # Responsive navigation header
│   │   │   ├── SiteFooter.tsx     # Footer with catalog links and company info
│   │   │   ├── MobileTabBar.tsx   # Mobile bottom navigation bar
│   │   │   └── MobileMenu.tsx     # Slide-over drawer navigation
│   │   ├── data/                  # Catalog shapes, mock data, and API clients
│   │   ├── pages/                 # Route pages (Home, Shop, Cart, Checkout, Profile, ...)
│   │   ├── App.tsx                # Primary routing layout
│   │   ├── index.css              # Global styles & responsive constraints
│   │   └── index.tsx              # Application entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                        # Express & Node.js backend API (MVC Architecture)
│   ├── config/                    # MongoDB connection configuration (db.js)
│   ├── controllers/               # Business logic controllers (auth, product, order, payment)
│   ├── middleware/                # JWT auth verification & admin guard middleware
│   ├── models/                    # Mongoose schemas (User, Product, Order, Category)
│   ├── routes/                    # Express API route handlers
│   ├── seed.js                    # Database seeder script
│   ├── index.js                   # Server entry point
│   └── package.json
├── scripts/                       # Developer automation & QA verification scripts
│   ├── run_qa_verification.cjs    # Puppeteer headless QA automated testing suite
│   ├── generate-mock.js           # Catalog mock data generator
│   └── debug.js                   # Headless browser inspection script
├── .gitignore                     # Comprehensive git ignore rules
└── README.md                      # Project documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express.js (CommonJS, RESTful API) |
| **Database** | MongoDB, Mongoose ODM |
| **Payments** | PayHere Payment Gateway (Sandbox Mode) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js |
| **Testing & QA** | Puppeteer (Headless Browser Automation), Chrome DevTools Mobile Emulation |

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/nr-accessories`) or MongoDB Atlas URI

---

### 2. Backend Setup
```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Check .env or .env.example:
# PORT=5001
# MONGO_URI=mongodb://127.0.0.1:27017/nr-accessories
# JWT_SECRET=your_jwt_secret

# (Optional) Seed the database with sample products and categories
npm run seed

# Start the backend server
npm run dev
# Server will run on http://localhost:5001
```

---

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
# Frontend will run on http://localhost:5173
```

---

### 4. Running Quality Assurance (QA) Automated Tests
To run the automated Puppeteer QA test suite (verifying 375px mobile viewport, form validation with green checkmarks, cart calculations, and localStorage persistence):

```bash
# From the project root (ensure frontend dev server is running on port 5173)
node scripts/run_qa_verification.cjs
```
Evidence screenshots will be saved automatically to `document/evidence/`.

---

## 📄 License
Academic project for ICT2142 E-Business Systems, Faculty of Technology. All rights reserved © 2026.
