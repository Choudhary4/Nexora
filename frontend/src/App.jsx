import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { orderService } from './services/api';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import './App.css';

function AppContent() {
  const { cart, closeCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  const handleOpenCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    closeCart();
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutError(null);
  };

  const handleCheckoutSubmit = async (name, email) => {
    try {
      const orderReceipt = await orderService.checkout(name, email);
      setReceipt(orderReceipt);
      setIsCheckoutOpen(false);
      setIsReceiptOpen(true);
      clearCart();
      setCheckoutError(null);
    } catch (error) {
      setCheckoutError(error.message);
      console.error('Checkout error:', error);
    }
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setReceipt(null);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <ProductGrid />
      </main>
      <CartPanel onCheckout={handleOpenCheckout} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        onSubmit={handleCheckoutSubmit}
        cart={cart}
      />
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        receipt={receipt}
      />
      {checkoutError && (
        <div className="error-toast">
          {checkoutError}
          <button onClick={() => setCheckoutError(null)}>×</button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
