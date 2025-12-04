// src/Pages/Cart.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { getCart as getCartAPI, removeFromCart, updateCartItem } from "../utils/apiMethods";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    
    if (token) {
      fetchCart();
    } else {
      loadLocalCart();
    }
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    const res = await getCartAPI();
    if (res.success) {
      // res.data is the cart object, items are nested
      const cartData = res.data;
      setCart(cartData.items || []);
    } else {
      console.error("Failed to fetch cart:", res.error);
    }
    setLoading(false);
  };

  const loadLocalCart = () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
  };

  const handleRemove = async (productId) => {
    if (isLoggedIn) {
      const res = await removeFromCart({ product_id: productId });
      if (res.success) {
        // Fetch fresh cart after removal
        const cartRes = await getCartAPI();
        if (cartRes.success) {
          setCart(cartRes.data.items || []);
        }
      } else {
        alert(`Error: ${res.error}`);
      }
    } else {
      const updatedCart = cart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      handleRemove(productId);
      return;
    }

    if (isLoggedIn) {
      const res = await updateCartItem({ product_id: productId, quantity });
      if (res.success) {
        // Fetch fresh cart after update
        const cartRes = await getCartAPI();
        if (cartRes.success) {
          setCart(cartRes.data.items || []);
        }
      } else {
        alert(`Error: ${res.error}`);
      }
    } else {
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const calculateTotal = () => {
    if (isLoggedIn && cart.length > 0 && cart[0].product) {
      // API cart with product object
      return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    }
    // Local cart
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getItemName = (item) => {
    return item.product?.name || item.name;
  };

  const getItemPrice = (item) => {
    return item.product?.price || item.price;
  };

  const total = calculateTotal();

  return (
    <div>
      <Header />
      <main className="p-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {loading ? (
          <p className="text-gray-600">Loading cart...</p>
        ) : cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty!</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4 p-3 border rounded-lg border-gray-200">
                <div className="flex-1">
                  <span className="font-medium">{getItemName(item)}</span>
                  <span className="text-gray-600 ml-2">₹{getItemPrice(item)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.product?.id || item.id, item.quantity - 1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product?.id || item.id, item.quantity + 1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.product?.id || item.id)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <p className="font-bold mt-6 text-xl">Total: ₹{total}</p>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
