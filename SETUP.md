# Getting Started

Two ways to run this - with or without MongoDB. Either works fine.

## The Simple Way (No Database Setup)

Just need Node.js installed.

**Terminal 1:**
```bash
cd backend
npm install
npm start
```

**Terminal 2:**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and you're set. The backend will store everything in memory.

## With MongoDB

If you want the cart to persist between restarts:

**Start MongoDB first:**
```bash
# Mac/Linux
brew services start mongodb-community

# Windows
net start MongoDB
```

Then run the same commands as above. The app will automatically connect to Mongo if it's running.

## Try It Out

1. Go to http://localhost:5173
2. Click "Add to Cart" on something
3. Cart opens on the right
4. Click "Proceed to Checkout"
5. Type in a name and email
6. Hit "Place Order"
7. You'll see a receipt with an order ID

## Check if the API Works

```bash
curl http://localhost:5000/api/products
curl http://localhost:5000/api/cart
curl http://localhost:5000/api/health
```

## If Something Breaks

**Port 5000 already taken?**
Change `PORT=5000` in `backend/.env` to something else like 5001

**MongoDB not connecting?**
Don't worry about it - the app will use memory storage instead. Everything still works.

**Frontend can't reach backend?**
Make sure the backend is running on port 5000. Frontend is hardcoded to look there.

**Nothing loads?**
Check both terminals for errors. Usually it's just a port conflict or missing `npm install`.
