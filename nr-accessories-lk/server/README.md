# SmartGear.lk / nr-accessories.lk — Backend API

Express + MongoDB (Mongoose) backend for the nr-accessories.lk MERN project.
Matches the ER diagram and collections from the Week 02 report (User, Category,
Product, Cart, Order — addresses embedded in User, cart/order items embedded
as subdocuments for simplicity).

## 1. Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — a free MongoDB Atlas connection string (https://www.mongodb.com/cloud/atlas)
- `JWT_SECRET` — any long random string
- `PORT` — defaults to 5000

## 2. (Optional) Seed sample data

Populates categories and a few sample products so the API returns real data
straight away:

```bash
npm run seed
```

## 3. Run the server

```bash
npm run dev     # with nodemon (auto-restart on changes)
# or
npm start
```

Server runs at `http://localhost:5000`. Visit `http://localhost:5000/` — you
should see `{ "status": "SmartGear.lk API is running" }`.

## 4. API Endpoints

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new account |
| POST | `/api/auth/login` | No | Log in, returns a JWT token |
| GET | `/api/auth/me` | Yes | Get the logged-in user's profile |
| GET | `/api/products` | No | List products (supports `?category=&brand=&search=&minPrice=&maxPrice=&page=&limit=`) |
| GET | `/api/products/:id` | No | Get one product |
| POST | `/api/products` | — | Create a product (admin use, e.g. via Postman) |
| PUT | `/api/products/:id` | — | Update a product |
| DELETE | `/api/products/:id` | — | Delete a product |
| GET | `/api/categories` | No | List all categories |
| POST | `/api/categories` | — | Create a category |
| GET | `/api/cart` | Yes | Get the logged-in user's cart |
| POST | `/api/cart/add` | Yes | Add a product to the cart `{ productId, quantity }` |
| PUT | `/api/cart/update` | Yes | Update quantity `{ productId, quantity }` |
| DELETE | `/api/cart/remove/:productId` | Yes | Remove an item from the cart |
| POST | `/api/orders` | Yes | Place an order from the current cart |
| GET | `/api/orders` | Yes | List the logged-in user's orders |
| GET | `/api/orders/:id` | Yes | Get one order |

For routes marked **Yes**, send the JWT from login/register in the header:
```
Authorization: Bearer <token>
```

## 5. Connecting the React frontend

In the frontend, replace the static imports from `data/catalog.ts` with
`fetch` calls to these endpoints, e.g.:

```js
useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => setProducts(data.products));
}, []);
```

## 6. Folder structure

```
server/
├── config/db.js          MongoDB connection
├── models/                Mongoose schemas (User, Product, Category, Cart, Order)
├── controllers/           Route logic
├── routes/                Express route definitions
├── middleware/auth.js     JWT auth middleware
├── seed.js                Sample data loader
├── index.js                Server entry point
└── .env.example
```
