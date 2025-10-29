# Nexora - Mock E-Commerce Shopping Cart

A minimal yet feature-complete MERN stack e-commerce shopping cart application for testing end-to-end cart flow.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Tech Stack

### Frontend
- **React** with Vite for fast development
- **Context API** for global state management
- **Custom CSS** for responsive, modern UI
- **Fetch API** for backend communication

### Backend
- **Node.js** runtime
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **RESTful API** architecture
- **In-memory fallback** when MongoDB is unavailable

## Features

- Browse product catalog with 8 featured items
- Add items to shopping cart with automatic quantity management
- Real-time cart updates with item count badge
- Sliding cart panel with item management
- Remove items from cart
- Automatic total calculation
- Checkout flow with form validation
- Order receipt with timestamp and order ID
- Cart persistence using MongoDB
- Mobile-responsive design
- Graceful error handling
- Auto-seeding of products

## Project Structure

```
Nexora/
├── backend/
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── CartPanel.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   └── ReceiptModal.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
└── README.md
```

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/products` | Fetch all products | - | Array of products |
| GET | `/api/cart` | Get current cart | - | Cart object with items & total |
| POST | `/api/cart` | Add item to cart | `{productId, qty}` | Updated cart |
| DELETE | `/api/cart/:id` | Remove item from cart | - | Updated cart |
| POST | `/api/checkout` | Checkout & create order | `{name, email}` | Receipt with order details |

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (optional - app falls back to in-memory storage)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
```bash
# .env file is already created with defaults:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexora
NODE_ENV=development
```

4. Start MongoDB (if using):
```bash
# On macOS/Linux with Homebrew:
brew services start mongodb-community

# On Windows:
net start MongoDB
```

5. Start the backend server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### User Flow

1. **Browse Products**: View the product grid on the home page
2. **Add to Cart**: Click "Add to Cart" button on any product
3. **View Cart**: Cart panel slides in automatically, showing:
   - All items in cart
   - Quantity for each item
   - Individual and total prices
4. **Manage Cart**:
   - Remove items using the trash icon
   - See real-time total updates
5. **Checkout**:
   - Click "Proceed to Checkout"
   - Fill in name and email
   - Submit order
6. **Receipt**: View order confirmation with:
   - Unique order ID
   - Timestamp
   - Order details
   - Total amount

### API Testing

You can test the API endpoints using curl or Postman:

```bash
# Get all products
curl http://localhost:5000/api/products

# Get cart
curl http://localhost:5000/api/cart

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID_HERE","qty":1}'

# Checkout
curl -X POST http://localhost:5000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

## Features in Detail

### In-Memory Fallback
If MongoDB is unavailable, the app automatically switches to in-memory storage:
- Products are served from a static array
- Cart data is stored in server memory
- All functionality remains operational

### Auto-Seeding
On first run with MongoDB:
- Database is automatically seeded with 8 products
- Products include images from Unsplash
- No manual setup required

### Cart Persistence
When using MongoDB:
- Cart persists across page refreshes
- Each user has a cart tied to `demo-user-123`
- Cart state synchronized between frontend and backend

### Error Handling
- API errors display toast notifications
- Form validation with inline error messages
- Graceful fallback when services are unavailable
- Loading states for async operations

## Screenshots

> **Note**: Add your application screenshots to the `screenshots` folder and they will be displayed here.

### Product Grid
![Product Grid](screenshots/product-grid.png)
*The main page displays all available products in a responsive grid layout with hover effects.*

### Shopping Cart Panel
![Cart Panel](screenshots/cart-panel.png)
*Sliding cart panel shows added items with quantities, prices, and removal options.*

### Checkout Flow
![Checkout Modal](screenshots/checkout-modal.png)
*Clean checkout form with validation for user details and order summary.*

### Order Receipt
![Order Receipt](screenshots/receipt-modal.png)
*Success confirmation with complete order details and unique order ID.*

### Mobile Responsive View
![Mobile View](screenshots/mobile-view.png)
*Fully responsive design optimized for mobile devices.*

### How to Add Screenshots

1. Run the application:
   ```bash
   npm run dev
   ```

2. Take screenshots of:
   - Product grid page
   - Cart panel (with items)
   - Checkout modal
   - Receipt/confirmation modal
   - Mobile view (use browser DevTools)

3. Save them in the `screenshots` folder with these names:
   - `product-grid.png`
   - `cart-panel.png`
   - `checkout-modal.png`
   - `receipt-modal.png`
   - `mobile-view.png`

4. The screenshots will automatically appear in this README!

## Development

### Backend Structure
- **Controllers**: Business logic for products, cart, and orders
- **Models**: Mongoose schemas for database entities
- **Routes**: API endpoint definitions
- **server.js**: Express app configuration and middleware

### Frontend Structure
- **Components**: Reusable UI components
- **Context**: Global state management with Context API
- **Services**: API integration layer
- **Styling**: Component-specific CSS files

## Technology Decisions

- **Vite over CRA**: Faster build times and HMR
- **Context API over Redux**: Simpler for this use case
- **Custom CSS**: No external UI library needed
- **In-Memory Fallback**: Development without MongoDB setup
- **Mock User ID**: Simplified authentication flow

## Future Enhancements

- User authentication
- Product search and filtering
- Multiple product images
- Quantity adjustment in cart
- Order history
- Payment gateway integration
- Admin panel for product management

## License

MIT

## Author

Built with MERN stack for e-commerce cart demonstration.

---

Generated with MERN Stack - MongoDB, Express, React, Node.js
