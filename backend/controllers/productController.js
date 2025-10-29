import Product from '../models/Product.js';

// In-memory fallback data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'Premium wireless headphones with noise cancellation',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 16499,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'Feature-packed smartwatch with fitness tracking',
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    description: 'Durable backpack with laptop compartment',
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    description: 'Portable bluetooth speaker with deep bass',
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    description: 'Ergonomic wireless mouse for work and gaming',
  },
  {
    id: '6',
    name: 'USB-C Hub',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
    description: 'Multi-port USB-C hub with HDMI and card reader',
  },
  {
    id: '7',
    name: 'Mechanical Keyboard',
    price: 10799,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    description: 'RGB mechanical keyboard with blue switches',
  },
  {
    id: '8',
    name: 'Phone Stand',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=400',
    description: 'Adjustable phone stand for desk',
  },
];

let useMemoryStorage = false;

// Get all products
export const getProducts = async (req, res) => {
  try {
    if (useMemoryStorage) {
      return res.json(mockProducts);
    }

    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data
    useMemoryStorage = true;
    res.json(mockProducts);
  }
};

// Seed products to database
export const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = mockProducts.map(({ id, ...product }) => product);
      await Product.insertMany(products);
      console.log('✅ Products seeded successfully');
    }
  } catch (error) {
    console.log('⚠️  Could not seed products, using in-memory storage');
    useMemoryStorage = true;
  }
};
