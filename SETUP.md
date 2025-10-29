# Quick Start Guide

## Option 1: Quick Start (Without MongoDB)

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:5000
(Uses in-memory storage automatically if MongoDB not available)

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173

## Option 2: With MongoDB

### 1. Start MongoDB:
```bash
# macOS/Linux
brew services start mongodb-community

# Windows
net start MongoDB
```

### 2. Backend:
```bash
cd backend
npm install
npm start
```

### 3. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Testing the App

1. Open http://localhost:5173
2. Click "Add to Cart" on any product
3. Cart panel slides open automatically
4. Click "Proceed to Checkout"
5. Fill in name and email
6. Click "Place Order"
7. View your receipt!

## API Testing

```bash
# Get products
curl http://localhost:5000/api/products

# Get cart
curl http://localhost:5000/api/cart

# Health check
curl http://localhost:5000/api/health
```

## Troubleshooting

**Port already in use:**
- Backend: Change PORT in backend/.env
- Frontend: Vite will prompt for alternative port

**MongoDB connection error:**
- App automatically falls back to in-memory storage
- All features still work!

**CORS errors:**
- Make sure backend is running on port 5000
- Frontend expects backend at http://localhost:5000
