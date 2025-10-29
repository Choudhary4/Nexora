import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const DEMO_USER_ID = 'demo-user-123';

// In-memory cart fallback
let memoryCart = {
  userId: DEMO_USER_ID,
  items: [],
  total: 0,
};

let useMemoryStorage = false;

// Helper to calculate total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Get cart
export const getCart = async (req, res) => {
  try {
    if (useMemoryStorage) {
      return res.json(memoryCart);
    }

    let cart = await Cart.findOne({ userId: DEMO_USER_ID });

    if (!cart) {
      cart = await Cart.create({
        userId: DEMO_USER_ID,
        items: [],
        total: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    useMemoryStorage = true;
    res.json(memoryCart);
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (useMemoryStorage) {
      // Memory storage logic
      const existingItemIndex = memoryCart.items.findIndex(
        item => item.productId === productId
      );

      if (existingItemIndex > -1) {
        memoryCart.items[existingItemIndex].quantity += qty;
      } else {
        // Mock product data for memory storage
        memoryCart.items.push({
          productId,
          name: 'Product',
          price: 2499,
          image: 'https://via.placeholder.com/150',
          quantity: qty,
        });
      }

      memoryCart.total = calculateTotal(memoryCart.items);
      return res.json(memoryCart);
    }

    // Find product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: DEMO_USER_ID });

    if (!cart) {
      cart = await Cart.create({
        userId: DEMO_USER_ID,
        items: [],
        total: 0,
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += qty;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: qty,
      });
    }

    cart.total = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (useMemoryStorage) {
      memoryCart.items = memoryCart.items.filter(item => item.productId !== id);
      memoryCart.total = calculateTotal(memoryCart.items);
      return res.json(memoryCart);
    }

    const cart = await Cart.findOne({ userId: DEMO_USER_ID });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== id);
    cart.total = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    if (useMemoryStorage) {
      memoryCart = {
        userId: DEMO_USER_ID,
        items: [],
        total: 0,
      };
      return memoryCart;
    }

    const cart = await Cart.findOne({ userId: DEMO_USER_ID });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }
    return cart;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
