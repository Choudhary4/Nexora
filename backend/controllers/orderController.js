import Order from '../models/Order.js';
import { clearCart } from './cartController.js';
import Cart from '../models/Cart.js';

const DEMO_USER_ID = 'demo-user-123';

// In-memory orders fallback
let memoryOrders = [];
let useMemoryStorage = false;

// Checkout and create order
export const checkout = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (useMemoryStorage) {
      const order = {
        id: `order-${Date.now()}`,
        userId: DEMO_USER_ID,
        name,
        email,
        items: [],
        total: 0,
        timestamp: new Date(),
      };
      memoryOrders.push(order);
      return res.json(order);
    }

    // Get current cart
    const cart = await Cart.findOne({ userId: DEMO_USER_ID });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Create order
    const order = await Order.create({
      userId: DEMO_USER_ID,
      name,
      email,
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: cart.total,
      timestamp: new Date(),
    });

    // Clear cart
    await clearCart();

    res.json({
      id: order._id,
      total: order.total,
      timestamp: order.timestamp,
      name: order.name,
      email: order.email,
      items: order.items,
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
};
