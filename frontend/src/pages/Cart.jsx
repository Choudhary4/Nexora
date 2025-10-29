import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { orderService } from "../services/api";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { cart, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    const name = prompt("Enter your name:");
    const email = prompt("Enter your email:");

    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setCheckoutLoading(true);
      const receipt = await orderService.checkout(name, email);
      toast.success(`Order placed successfully! Order ID: ${receipt.id}`);
      clearCart();
    } catch (error) {
      toast.error(error.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div>
      {cart.items.length > 0 ? (
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-center">
          <div className="w-[100%] md:w-[60%] flex flex-col p-2">
            {cart.items.map((item, index) => {
              return (
                <CartItem
                  key={item.productId || item._id}
                  item={item}
                  itemIndex={index}
                  cartLength={cart.items.length}
                />
              );
            })}
          </div>

          <div className="flex flex-col w-full md:w-[40%] mt-5">
            <div className="flex flex-col p-5 gap-5 my-14 h-full justify-between">
              <div className="flex flex-col gap-5">
                <div className="font-semibold text-xl text-green-800">Your Cart</div>
                <div className="font-semibold text-5xl text-green-700">Summary</div>
                <p className="text-xl">
                  <span>Total Items: {cart.items.length}</span>
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold">
                  Total Amount: ₹{cart.total.toLocaleString('en-IN')}
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="bg-green-700 hover:bg-purple-50 rounded-lg text-white transition duration-300 ease-linear mt-5 border-2 border-green-600 font-bold hover:text-green-700 p-3 text-xl disabled:opacity-50"
                >
                  {checkoutLoading ? "Processing..." : "Checkout Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <h1 className="text-gray-700 font-semibold text-xl mb-2">
            Your cart is empty!
          </h1>
          <Link to={"/"}>
            <button className="uppercase bg-green-600 hover:bg-purple-50 rounded-lg text-white transition duration-300 ease-linear mt-5 border-2 border-green-600 font-semibold hover:text-green-700 p-3 px-10 tracking-wider">
              Shop Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
