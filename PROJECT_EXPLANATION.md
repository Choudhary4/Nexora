# Nexora - Complete Project Explanation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Design](#architecture--design)
4. [Backend Structure](#backend-structure)
5. [Frontend Structure](#frontend-structure)
6. [Key Features](#key-features)
7. [Data Flow](#data-flow)
8. [API Documentation](#api-documentation)
9. [Setup & Installation](#setup--installation)
10. [Usage Guide](#usage-guide)
11. [Technical Highlights](#technical-highlights)

---

## Project Overview

**Nexora** is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce shopping cart application designed to demonstrate a complete end-to-end shopping experience. It features a modern, responsive UI with a functional product catalog, shopping cart management, and checkout system.

### Purpose
- Demonstrate MERN stack implementation
- Showcase modern React patterns (Context API, custom hooks)
- Implement RESTful API design
- Provide a resilient application with fallback mechanisms

### Mock Features
- Demo user ID: `demo-user-123`
- 8 pre-seeded tech products
- In-memory storage fallback when MongoDB is unavailable

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.1 | UI library for building components |
| Vite | 7.1.7 | Fast build tool and dev server |
| React Router DOM | Latest | Client-side routing |
| React Hot Toast | Latest | Toast notifications |
| React Icons | Latest | Icon components |

**Why these choices?**
- **Vite over Create React App**: Faster build times, better HMR (Hot Module Replacement)
- **Context API**: Simpler state management than Redux for this scope
- **Custom CSS**: No UI library needed, full design control, smaller bundle

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | v14+ | JavaScript runtime |
| Express.js | 4.18.2 | Web application framework |
| MongoDB | 8.0.3 | NoSQL database |
| Mongoose | Latest | MongoDB object modeling |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Dotenv | 16.3.1 | Environment variable management |
| Nodemon | 3.0.2 | Development auto-reload |

**Why these choices?**
- **Express**: Lightweight, flexible, industry standard
- **MongoDB**: Document-based storage perfect for product catalogs
- **Mongoose**: Schema validation and elegant MongoDB interaction

---

## Architecture & Design

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Header    │  │ ProductGrid  │  │  CartPanel     │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Checkout   │  │   Receipt    │  │   Context API  │  │
│  │   Modal    │  │    Modal     │  │  (CartContext) │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                   Backend (Express)                      │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Routes    │→ │ Controllers  │→ │    Models      │  │
│  │ (Endpoints)│  │ (Logic)      │  │  (Schemas)     │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────┐
│              MongoDB Database / In-Memory                │
│         Products  |  Cart  |  Orders                     │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns

1. **MVC Pattern** (Backend)
   - Models: Data schemas and database interaction
   - Controllers: Business logic
   - Routes: API endpoint definitions

2. **Provider Pattern** (Frontend)
   - `CartProvider` wraps the entire app
   - Provides global cart state to all components

3. **Custom Hooks**
   - `useCart()` hook for accessing cart context

4. **Service Layer**
   - `api.js` abstracts all backend communication
   - Centralized error handling

5. **Component Composition**
   - Reusable UI components
   - Modal and panel overlays

---

## Backend Structure

### Directory Organization

```
backend/
├── controllers/           # Business logic
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── models/               # Database schemas
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/               # API endpoints
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── .env                  # Environment variables
├── server.js             # Express app setup
└── package.json
```

### Models Explained

#### Product Model
```javascript
{
  name: String,           // Product name
  price: Number,          // Price in rupees
  image: String,          // Unsplash image URL
  description: String,    // Product description
  timestamps: true        // Auto createdAt, updatedAt
}
```

#### Cart Model
```javascript
{
  userId: String,         // Default: "demo-user-123"
  items: [{
    productId: ObjectId,  // Reference to Product
    name: String,
    price: Number,
    image: String,
    description: String,
    quantity: Number
  }],
  total: Number,          // Calculated total
  timestamps: true
}
```

#### Order Model
```javascript
{
  userId: String,         // Customer identifier
  name: String,           // Customer name
  email: String,          // Customer email
  items: Array,           // Cart items at time of order
  total: Number,          // Order total
  timestamp: Date,        // Order placement time
  timestamps: true
}
```

### Controllers Explained

#### Product Controller
- **getProducts()**: Retrieves all products from database or serves 8 mock products
- **seedProducts()**: Auto-populates database with sample products on first run
- **Fallback**: Includes in-memory product array for MongoDB-less operation

#### Cart Controller
- **getCart()**: Fetches user's cart (creates empty cart if none exists)
- **addToCart()**: Adds product to cart or increments quantity if already present
- **removeFromCart()**: Removes item by product ID
- **clearCart()**: Empties entire cart
- **calculateTotal()**: Helper to sum item prices × quantities

#### Order Controller
- **checkout()**: Creates order from cart, validates input, clears cart
- Returns order receipt with unique order ID and timestamp

### API Routes

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| GET | `/api/products` | `productController.getProducts` | Get all products |
| GET | `/api/cart` | `cartController.getCart` | Get user's cart |
| POST | `/api/cart` | `cartController.addToCart` | Add item to cart |
| DELETE | `/api/cart/:id` | `cartController.removeFromCart` | Remove cart item |
| POST | `/api/checkout` | `orderController.checkout` | Create order |
| GET | `/api/health` | - | Health check |

### Server Configuration

**[server.js](server.js)**
- Express setup with middleware (CORS, JSON parser)
- MongoDB connection with error handling
- Auto-seeding products on successful DB connection
- In-memory fallback if MongoDB unavailable
- Environment variable configuration
- Runs on port 5000 (configurable)

---

## Frontend Structure

### Directory Organization

```
frontend/src/
├── components/           # UI components
│   ├── Header.jsx
│   ├── Header.css
│   ├── ProductGrid.jsx
│   ├── ProductGrid.css
│   ├── CartPanel.jsx
│   ├── CartPanel.css
│   ├── CheckoutModal.jsx
│   ├── CheckoutModal.css
│   ├── ReceiptModal.jsx
│   └── ReceiptModal.css
├── context/              # Global state
│   └── CartContext.jsx
├── services/             # API layer
│   └── api.js
├── App.jsx               # Main app
├── App.css
├── index.css             # Global styles
└── main.jsx              # React entry
```

### Context API Implementation

**[CartContext.jsx](frontend/src/context/CartContext.jsx)**

Provides global cart state management:

```javascript
// State variables
- cart: { items: [], total: 0 }
- isCartOpen: boolean
- loading: boolean
- error: string | null

// Methods
- fetchCart()              // Load cart from backend
- addToCart(productId, qty)
- removeFromCart(productId)
- clearCart()
- toggleCart()
- closeCart()
```

**Custom Hook**: `useCart()` allows any component to access cart context.

### Component Breakdown

#### Header
- Displays app branding ("Nexora")
- Cart button with item count badge
- Opens cart panel on click

#### ProductGrid
- Fetches and displays all products
- Responsive grid layout (3 columns → 1 on mobile)
- Loading spinner during fetch
- Error state with retry button
- Maps products to individual cards

#### Product Card
- Product image, name, description, price
- "Add to Cart" button
- Hover effects for better UX
- Price formatted as Indian rupees (₹)

#### CartPanel
- Sliding overlay from right side
- Shows cart items or empty state
- Each item displays: image, name, price, quantity, remove button
- Cart total with "Proceed to Checkout" button
- Close on overlay click or close button

#### CheckoutModal
- Modal overlay with checkout form
- Order summary section
- Form fields: Full Name, Email
- Client-side validation:
  - Required field checks
  - Email format validation
  - Real-time error clearing
- "Place Order" button

#### ReceiptModal
- Success confirmation screen
- Displays:
  - Order ID
  - Formatted date/time
  - Customer details
  - Order items with quantities
  - Total amount
- "Continue Shopping" button

### Services Layer

**[api.js](frontend/src/services/api.js)**

Centralized API communication:

```javascript
// Product Service
productService.getProducts()

// Cart Service
cartService.getCart()
cartService.addToCart(productId, qty)
cartService.removeFromCart(productId)

// Order Service
orderService.checkout(name, email)
```

Benefits:
- Single source of truth for API endpoints
- Consistent error handling
- Easy to mock for testing
- Clean component code

---

## Key Features

### 1. Product Catalog
- **8 Featured Products**: Tech accessories with realistic data
- **Product Details**: Name, description, price, high-quality images
- **Responsive Grid**: 3 columns on desktop, 1 on mobile
- **Loading States**: Spinner while fetching data
- **Error Handling**: Retry button if fetch fails

### 2. Shopping Cart
- **Add to Cart**: One-click adding from product cards
- **Quantity Management**: Automatically increments if item already in cart
- **Real-time Badge**: Header shows current item count
- **Sliding Panel**: Cart opens from right side with smooth animation
- **Cart Management**:
  - View all items
  - See quantities and individual totals
  - Remove items with trash icon
  - Running total updates automatically
- **Empty State**: Friendly message when cart is empty
- **Persistence**: Cart saved to MongoDB (or in-memory)

### 3. Checkout Process
- **Modal Interface**: Focused checkout experience
- **Order Summary**: Review items and total before purchase
- **Form Validation**:
  - Name required
  - Valid email required
  - Inline error messages
  - Errors clear as user types
- **Smooth UX**: Form submission with loading state

### 4. Order Confirmation
- **Receipt Modal**: Success confirmation after checkout
- **Order Details**:
  - Unique order ID (MongoDB ObjectID)
  - Formatted timestamp
  - Customer name and email
  - Complete item list with quantities
  - Total amount
- **Cart Clearing**: Automatic reset after order placed

### 5. Responsive Design
- **Mobile-First**: Works perfectly on all screen sizes
- **Breakpoints**: Optimized for mobile, tablet, desktop
- **Touch-Friendly**: Large tap targets, swipe-friendly panels

### 6. Error Handling & Resilience
- **MongoDB Fallback**: In-memory storage if database unavailable
- **Error Toasts**: User-friendly error messages
- **Graceful Degradation**: App remains functional during failures
- **Loading States**: Visual feedback for all async operations
- **Auto-Retry**: Retry buttons for failed operations

### 7. Developer Experience
- **Hot Module Replacement**: Instant updates during development
- **Clear Structure**: Organized files and folders
- **Inline Comments**: Well-documented code
- **Environment Variables**: Easy configuration
- **Concurrent Scripts**: Run frontend and backend together

---

## Data Flow

### Adding Item to Cart

```
1. User clicks "Add to Cart" on Product Card
   ↓
2. Product component calls useCart().addToCart(productId, 1)
   ↓
3. CartContext makes API call via cartService.addToCart()
   ↓
4. POST request to backend: /api/cart
   ↓
5. Backend cartController.addToCart() processes request
   ↓
6. Controller finds/creates cart in MongoDB
   ↓
7. Adds item or increments quantity
   ↓
8. Calculates new total
   ↓
9. Saves cart to database
   ↓
10. Returns updated cart to frontend
   ↓
11. CartContext updates state with new cart
   ↓
12. React re-renders affected components (badge, cart panel)
   ↓
13. Cart panel slides open to show added item
```

### Checkout Flow

```
1. User clicks "Proceed to Checkout" in Cart Panel
   ↓
2. App component opens CheckoutModal
   ↓
3. Modal displays order summary from cart context
   ↓
4. User fills name and email
   ↓
5. Client-side validation on form submit
   ↓
6. If valid, POST to /api/checkout with {name, email}
   ↓
7. Backend orderController.checkout() receives request
   ↓
8. Validates input
   ↓
9. Fetches user's cart
   ↓
10. Creates new Order document in MongoDB
   ↓
11. Clears user's cart
   ↓
12. Returns order receipt (orderId, timestamp, items, total)
   ↓
13. Frontend receives receipt data
   ↓
14. Closes checkout modal
   ↓
15. Opens receipt modal with order details
   ↓
16. Updates cart context to empty state
   ↓
17. Cart badge shows 0 items
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Currently uses mock user ID: `demo-user-123` (hardcoded in backend)

### Endpoints

#### 1. Get Products
**Endpoint**: `GET /api/products`

**Description**: Fetches all available products

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Wireless Headphones",
    "price": 6499,
    "image": "https://images.unsplash.com/...",
    "description": "Premium noise-cancelling...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 2. Get Cart
**Endpoint**: `GET /api/cart`

**Description**: Retrieves current user's cart

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "demo-user-123",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "name": "Wireless Headphones",
      "price": 6499,
      "image": "https://images.unsplash.com/...",
      "description": "Premium noise-cancelling...",
      "quantity": 2,
      "_id": "507f1f77bcf86cd799439013"
    }
  ],
  "total": 12998,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 3. Add to Cart
**Endpoint**: `POST /api/cart`

**Description**: Adds item to cart or increments quantity

**Request Body**:
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "qty": 1
}
```

**Response**: Same as Get Cart

#### 4. Remove from Cart
**Endpoint**: `DELETE /api/cart/:id`

**Description**: Removes item from cart by product ID

**URL Parameters**:
- `id`: Product ID to remove

**Response**: Updated cart object

#### 5. Checkout
**Endpoint**: `POST /api/checkout`

**Description**: Creates order and clears cart

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "receipt": {
    "orderId": "507f1f77bcf86cd799439014",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "name": "John Doe",
    "email": "john@example.com",
    "items": [...],
    "total": 12998
  }
}
```

**Error Response** (400):
```json
{
  "error": "Name and email are required"
}
```

#### 6. Health Check
**Endpoint**: `GET /api/health`

**Description**: Server health check

**Response**:
```json
{
  "status": "ok"
}
```

---

## Setup & Installation

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- MongoDB (optional - in-memory fallback available)
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Nexora
```

### Step 2: Install Dependencies

**Option A: Install All at Once**
```bash
npm run install:all
```

**Option B: Install Separately**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 3: Configure Environment Variables

Backend `.env` file (already created):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexora
NODE_ENV=development
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexora
```

### Step 4: Start MongoDB (if using local)

**macOS/Linux**:
```bash
brew services start mongodb-community
```

**Windows**:
```bash
net start MongoDB
```

**Or skip this step** - app will use in-memory fallback

### Step 5: Run the Application

**Option A: Run Both Servers Concurrently**
```bash
# From project root
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd backend
npm start
# Or with auto-reload:
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

## Usage Guide

### For End Users

1. **Browse Products**
   - Open http://localhost:5173
   - View 8 featured tech products
   - Read descriptions and prices

2. **Add to Cart**
   - Click "Add to Cart" on any product
   - Cart panel opens automatically
   - Item appears in cart with quantity 1
   - Click again to increment quantity

3. **Manage Cart**
   - Click cart icon in header to toggle panel
   - View all items, quantities, and prices
   - Click trash icon to remove items
   - See total update in real-time

4. **Checkout**
   - Click "Proceed to Checkout" in cart
   - Review order summary
   - Enter your name and email
   - Click "Place Order"

5. **View Receipt**
   - See order confirmation modal
   - Note your order ID for reference
   - View order details and timestamp
   - Click "Continue Shopping" to close

6. **Continue Shopping**
   - Cart is now empty
   - Add more items to start new order

### For Developers

#### Testing API with cURL

```bash
# Get products
curl http://localhost:5000/api/products

# Get cart
curl http://localhost:5000/api/cart

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId":"YOUR_PRODUCT_ID","qty":1}'

# Remove from cart
curl -X DELETE http://localhost:5000/api/cart/YOUR_PRODUCT_ID

# Checkout
curl -X POST http://localhost:5000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

#### Development Workflow

1. **Frontend Development**
   - Edit files in `frontend/src/`
   - Vite HMR updates instantly
   - Check browser console for errors

2. **Backend Development**
   - Edit files in `backend/`
   - Nodemon restarts server automatically
   - Check terminal for logs

3. **Database Development**
   - Use MongoDB Compass to view data
   - Or use mongo shell: `mongosh nexora`

#### Adding New Products

Edit [backend/controllers/productController.js](backend/controllers/productController.js):

```javascript
const mockProducts = [
  // Add your product here
  {
    id: '9',
    name: 'New Product',
    price: 9999,
    image: 'https://images.unsplash.com/...',
    description: 'Product description'
  }
];
```

#### Customizing Styling

- Global styles: [frontend/src/index.css](frontend/src/index.css)
- Component styles: `frontend/src/components/ComponentName.css`
- App-wide styles: [frontend/src/App.css](frontend/src/App.css)

---

## Technical Highlights

### 1. Dual Storage Strategy
The app seamlessly switches between MongoDB and in-memory storage:

```javascript
// In server.js
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
} catch (error) {
  console.log('MongoDB unavailable, using in-memory storage');
}
```

This ensures the app always works, even without database setup.

### 2. Auto-Seeding Products
On first MongoDB connection, products are automatically populated:

```javascript
const existingProducts = await Product.find();
if (existingProducts.length === 0) {
  await seedProducts();
}
```

No manual database setup required!

### 3. Context API State Management
Clean, simple global state without Redux:

```javascript
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  // ... methods
  return (
    <CartContext.Provider value={{ cart, addToCart, ... }}>
      {children}
    </CartContext.Provider>
  );
};
```

Any component can access cart with `useCart()`.

### 4. Service Layer Abstraction
All API calls centralized in `api.js`:

```javascript
export const cartService = {
  getCart: async () => {
    const res = await fetch(`${API_BASE_URL}/cart`);
    return res.json();
  }
};
```

Benefits: Easy to mock, test, and modify.

### 5. Responsive Design
Mobile-first CSS with breakpoints:

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
```

### 6. Real-time Cart Updates
Cart badge and total update instantly:

```javascript
// Context provides cart state
const { cart } = useCart();

// Component automatically re-renders when cart changes
<span className="cart-badge">{cart.items.length}</span>
```

### 7. Form Validation
Client-side validation with good UX:

```javascript
const validateForm = () => {
  if (!name.trim()) {
    setError('Name is required');
    return false;
  }
  if (!email.includes('@')) {
    setError('Valid email is required');
    return false;
  }
  return true;
};
```

Errors clear as user types for smooth experience.

### 8. Error Handling
Comprehensive error handling at every level:

```javascript
try {
  // API call
} catch (error) {
  setError(error.message || 'Something went wrong');
}
```

User sees friendly messages, not stack traces.

### 9. Loading States
Visual feedback for all async operations:

```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    // API call
  } finally {
    setLoading(false);
  }
};

return loading ? <Spinner /> : <Content />;
```

### 10. Component Composition
Reusable, composable components:

```javascript
<App>
  <CartProvider>
    <Header />
    <ProductGrid />
    <CartPanel />
    <CheckoutModal />
    <ReceiptModal />
  </CartProvider>
</App>
```

Each component has single responsibility.

---

## Product Catalog Details

The application includes 8 default products:

| Product | Price | Description |
|---------|-------|-------------|
| Wireless Headphones | ₹6,499 | Premium noise-cancelling headphones with 30hr battery |
| Smart Watch | ₹16,499 | Fitness tracker with heart rate monitor |
| Laptop Backpack | ₹3,999 | Water-resistant with USB charging port |
| Bluetooth Speaker | ₹4,999 | Portable 360° sound with 12hr battery |
| Wireless Mouse | ₹2,499 | Ergonomic design with precision tracking |
| USB-C Hub | ₹3,299 | 7-in-1 adapter with 4K HDMI support |
| Mechanical Keyboard | ₹10,799 | RGB backlit with tactile switches |
| Phone Stand | ₹1,599 | Adjustable aluminum desk stand |

All products feature:
- High-quality images from Unsplash
- Realistic descriptions
- Indian rupee pricing
- Tech/gadget theme

---

## Future Enhancement Ideas

### Short-term
1. **Quantity Selectors**: Allow changing quantity in cart panel
2. **Product Search**: Filter products by name
3. **Product Categories**: Group products (Audio, Wearables, Accessories)
4. **Wishlist**: Save items for later
5. **Product Details Page**: Dedicated page with more images and info

### Medium-term
6. **User Authentication**: JWT-based login/register
7. **Order History**: View past orders
8. **Address Management**: Save multiple shipping addresses
9. **Payment Integration**: Stripe/Razorpay integration
10. **Email Notifications**: Order confirmations via email

### Long-term
11. **Admin Panel**: Manage products, orders, users
12. **Inventory Management**: Track stock levels
13. **Product Reviews**: User ratings and comments
14. **Recommendation Engine**: "You might also like..."
15. **Multi-language Support**: i18n implementation

---

## Troubleshooting

### MongoDB Connection Issues
**Problem**: "MongoDB connection failed"
**Solution**:
- Check MongoDB is running: `mongosh`
- Verify MONGODB_URI in .env
- App will fallback to in-memory storage automatically

### Port Already in Use
**Problem**: "Port 5000 already in use"
**Solution**:
```bash
# Find process using port
lsof -i :5000
# Kill it
kill -9 <PID>
# Or change port in backend/.env
```

### CORS Errors
**Problem**: "CORS policy blocked"
**Solution**: Backend already has CORS enabled for all origins in development

### Frontend Won't Load
**Problem**: "Cannot GET /"
**Solution**: Make sure you're accessing http://localhost:5173 (Vite port), not 5000 (API port)

### Products Not Showing
**Problem**: Empty product grid
**Solution**:
- Check backend is running
- Open http://localhost:5000/api/products in browser
- Check browser console for errors
- Click "Try Again" button

---

## Contributing Guidelines

### Code Style
- Use ESLint for linting
- Follow existing code patterns
- Add comments for complex logic
- Keep components small and focused

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push and create PR
git push origin feature/your-feature
```

### Testing
Currently no automated tests. Manual testing checklist:
- [ ] Add products to cart
- [ ] Remove products from cart
- [ ] Checkout with valid/invalid data
- [ ] Test on mobile viewport
- [ ] Test with MongoDB disconnected

---

## License

MIT License - feel free to use this project for learning, portfolio, or commercial purposes.

---

## Acknowledgments

- Product images from [Unsplash](https://unsplash.com)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Built with [Vite](https://vitejs.dev/) and [Express](https://expressjs.com/)

---

## Contact & Support

For questions or issues:
1. Check this documentation
2. Review inline code comments
3. Check browser/server console logs
4. Review MongoDB connection status

---

**Built with MERN Stack**
MongoDB • Express • React • Node.js

---

*Last Updated: January 2025*
