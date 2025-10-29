# Nexora - Project Deep Dive

This doc goes into more detail about how the project is structured and why certain decisions were made. If you just want to run it, check the main README instead.

## What This Is

Nexora is a full-stack shopping cart app built to practice/demonstrate MERN stack development. It's got everything you'd expect - product listings, cart management, checkout, and order confirmations. Nothing fancy, but it all works.

The name "Nexora" doesn't mean anything - just sounded good.

## Tech Choices

### Frontend

**React 19** - For building the UI. Went with the latest version because why not.

**Vite** - Switched from Create React App because the build times were killing me. Vite is crazy fast and the dev server starts instantly.

**Context API** - Could've used Redux but that felt like way too much boilerplate for just managing a shopping cart. Context API is built-in and gets the job done.

**No UI Framework** - Wrote all the CSS myself. Could've used Material-UI or Tailwind, but wanted to keep dependencies minimal. Plus it's good practice.

**React Icons** - Only external UI library. Because making custom icons is tedious.

### Backend

**Express** - Standard choice for Node.js APIs. Simple, flexible, huge ecosystem.

**MongoDB + Mongoose** - Went with Mongo because product catalogs fit well in a document database. Mongoose makes the queries cleaner.

**In-memory Fallback** - This was a later addition. Got tired of spinning up MongoDB every time I wanted to test something. Now if Mongo isn't running, the app just uses memory instead. Makes it way easier to demo.

**CORS** - Wide open in development. In production you'd obviously lock this down.

## How It's Organized

### Backend Structure

```
backend/
├── controllers/     # All the logic
├── models/          # Database schemas
├── routes/          # URL → controller mapping
└── server.js        # Entry point, DB connection
```

**Controllers** handle the actual work:
- `productController` - Returns products, handles auto-seeding
- `cartController` - Add/remove items, calculate totals
- `orderController` - Creates orders from cart contents

**Models** define the data structure:
- `Product` - name, price, image, description
- `Cart` - userId, items array, total
- `Order` - order details, timestamp, items snapshot

**Routes** are just thin wrappers that connect URLs to controllers.

### Frontend Structure

```
frontend/src/
├── components/      # UI pieces
├── context/         # Global state (CartContext)
├── services/        # API calls (api.js)
└── App.jsx          # Main component
```

**Components** are split up by what they do:
- `Header` - Logo and cart button
- `ProductGrid` - Shows all products
- `CartPanel` - Sliding sidebar with cart contents
- `CheckoutModal` - Checkout form overlay
- `ReceiptModal` - Order confirmation

**CartContext** manages everything cart-related:
- Fetches cart from backend
- Add/remove items
- Opens/closes the cart panel
- Shared across all components via `useCart()` hook

**API service** centralizes all backend calls. Instead of fetch() scattered everywhere, it's all in one file. Makes it easier to change the base URL or add auth later.

## Key Features

### Auto-Seeding

When the backend first connects to MongoDB, it checks if any products exist. If the database is empty, it automatically creates 8 sample products. No manual setup needed.

The products are hardcoded in `productController.js`. In a real app you'd have an admin panel for this.

### MongoDB Fallback

The coolest part (in my opinion) is the automatic fallback. If MongoDB isn't running or fails to connect, the app doesn't crash. It just logs a warning and switches to in-memory storage.

Both the products and cart work the same either way. You lose persistence between restarts, but for demos or quick testing it's perfect.

### Cart Persistence

When using MongoDB, your cart sticks around between page refreshes. It's tied to a hardcoded user ID (`demo-user-123`) since there's no real auth.

In a real app you'd tie the cart to the logged-in user's ID.

### Real-time Updates

Add something to the cart and the badge in the header updates immediately. Remove an item and the total recalculates. This all happens through Context API - when the cart state changes, React re-renders any component using that state.

### Form Validation

The checkout form has basic validation:
- Name can't be empty
- Email has to look like an email
- Errors show up inline
- Errors clear as you start typing

Not super robust, but enough to prevent obviously bad data.

## Data Flow

Here's what happens when you add something to your cart:

1. Click "Add to Cart" on a product
2. Product component calls `addToCart()` from CartContext
3. Context makes a POST request to `/api/cart`
4. Backend controller finds/creates your cart in Mongo
5. Adds the item (or increments quantity if already there)
6. Recalculates total
7. Saves to database
8. Sends back the updated cart
9. Context updates its state
10. React re-renders (badge, cart panel, etc.)
11. Cart panel slides open automatically

Checkout works similarly but also clears the cart and creates an Order document.

## API Endpoints

Five main endpoints:

**GET /api/products** - Returns all products (from DB or memory)

**GET /api/cart** - Gets your cart, creates empty one if needed

**POST /api/cart** - Body: `{productId, qty}` - Adds item

**DELETE /api/cart/:id** - Removes item by product ID

**POST /api/checkout** - Body: `{name, email}` - Creates order, returns receipt

Also a health check at `/api/health` that just returns 200 OK.

## The Products

Eight products are included:
- Wireless Headphones (₹6,499)
- Smart Watch (₹16,499)
- Laptop Backpack (₹3,999)
- Bluetooth Speaker (₹4,999)
- Wireless Mouse (₹2,499)
- USB-C Hub (₹3,299)
- Mechanical Keyboard (₹10,799)
- Phone Stand (₹1,599)

All tech/gadget stuff. Images are pulled from Unsplash. Prices are in Indian rupees because that's what toLocaleString('en-IN') gives you.

## Design Decisions

### Why No User Auth?

This is a demo project focused on the cart functionality. Adding auth would've doubled the complexity for something that's not the main point. The hardcoded user ID keeps it simple.

If I were to add it, probably go with JWT tokens and protect the cart/checkout routes.

### Why No Tests?

Honestly? Time. This was a learning project and I wanted to focus on actually building the features. In a real project you'd definitely want tests.

If I added them:
- Jest + React Testing Library for frontend
- Supertest for API endpoint tests
- Some kind of integration tests for the full flow

### Why Not TypeScript?

Personal preference. For small projects like this, plain JavaScript moves faster. TypeScript is great for bigger teams/codebases but felt unnecessary here.

### Why Context API vs Redux?

Redux is overkill for this use case. You're basically just sharing cart state between a handful of components. Context API handles it fine and doesn't require learning another library.

If the state got more complex (user auth, product filters, wishlists, etc.) then maybe Redux would make sense.

## Things I'd Add Next

If I kept working on this:

1. **Real auth** - Ditch the demo user ID, add login/register
2. **Quantity controls** - Let users change quantities in the cart
3. **Product search** - Filter by name or category
4. **Better validation** - Phone numbers, address fields, etc.
5. **Payment** - Integrate Stripe or Razorpay
6. **Order history** - Let users see past orders
7. **Admin panel** - Add/edit/delete products without touching code
8. **Email confirmations** - Send order receipts via email
9. **Inventory tracking** - Prevent ordering out-of-stock items
10. **Tests** - Mentioned above, but worth repeating

## Running in Production

This setup is dev-focused. For production you'd want:

- Environment variables for API URL (not hardcoded localhost)
- Proper error logging (Winston, Sentry, whatever)
- Rate limiting on API endpoints
- Input sanitization (prevent injection attacks)
- HTTPS everywhere
- Locked-down CORS
- Compressed responses
- CDN for static files
- Database indexes for faster queries
- Maybe switch to PostgreSQL if you need better transaction support

## Common Questions

**Why is everything in one repo?**
Monorepo made it easier to manage during development. Could split it into separate repos if needed.

**Can I use this for a real store?**
Technically yes, but you'd need to add a lot:
- Real auth
- Payment processing
- Proper security
- Terms of service, privacy policy
- Customer support system
- Refund handling
- Email notifications
- Probably way more

**Is the in-memory storage safe?**
For dev/demos? Sure. For production? Absolutely not. You'd lose everything on restart.

**What's the performance like?**
Fine for a demo with 8 products. With thousands of products you'd need:
- Pagination
- Database indexes
- Caching (Redis)
- Maybe search (Elasticsearch)

## File Sizes

Just for reference:
- Backend: ~15 files, few hundred lines total
- Frontend: ~12 components, maybe 500-600 lines
- Total dependencies: ~600MB (node_modules is always huge)

## Browser Support

Works on:
- Chrome/Edge (Chromium)
- Firefox
- Safari

Probably works on older browsers too but haven't tested.

## License

MIT - do whatever you want with it. Would appreciate credit but not required.

## Final Thoughts

This project was built to practice full-stack development and understand how the pieces fit together. It's not perfect and there's definitely stuff I'd do differently now, but it works and demonstrates the core concepts.

If you're learning MERN stack, feel free to use this as a reference or starting point. The code is straightforward and hopefully well-commented enough to follow along.

---

Questions? Issues? PRs welcome.
