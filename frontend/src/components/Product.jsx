import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from "react-hot-toast";

const Product = ({ post }) => {
  const { cart, addToCart, removeFromCart } = useCart();

  // Check if product is in cart
  const isInCart = cart.items.some(item => item.productId === post._id || item.productId === post.id);

  function handleAddToCart() {
    addToCart(post._id || post.id, 1);
    toast.success("Item Added Successfully");
  }

  function handleRemoveFromCart() {
    removeFromCart(post._id || post.id);
    toast.error("Item Removed Successfully");
  }

  return (
    <div className="flex flex-col items-center justify-between hover:scale-110 transition duration-300 ease-in shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] gap-3 p-4 mt-10 ml-5 rounded-xl group hover:shadow-[0px_-50px_100px_80px_rgba(0,0,0,0.08)]">
      <div>
        <p className="text-gray-700 font-semibold text-lg text-left truncate w-40 mt-1">
          {post.name}
        </p>
      </div>

      <div>
        <p className="w-40 text-gray-400 font-normal text-[10px] text-left">
          {post.description ? post.description.split(" ").slice(0, 10).join(" ") + "..." : ""}
        </p>
      </div>

      <div className="h-[180px]">
        <img src={post.image} className="h-full w-full" alt={post.name} />
      </div>

      <div className="flex justify-between gap-12 items-center w-full mt-5">
        <div>
          <p className="text-green-600 font-semibold">₹{post.price.toLocaleString('en-IN')}</p>
        </div>

        {isInCart ? (
          <button
            className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold
            text-[12px] p-1 px-3 uppercase
            hover:bg-gray-700
            hover:text-white transition duration-300 ease-in"
            onClick={handleRemoveFromCart}
          >
            REMOVE ITEM
          </button>
        ) : (
          <button
            className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold
            text-[12px] p-1 px-3 uppercase
            hover:bg-gray-700
            hover:text-white transition duration-300 ease-in"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
