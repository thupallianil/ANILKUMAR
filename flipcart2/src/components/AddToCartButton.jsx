// src/components/AddToCartButton.jsx
import React, { useState } from "react";
import { addToCart as addToLocalCart, getCartCount } from "../utils/cart";
import { addToCart as addToCartAPI } from "../utils/apiMethods";

const AddToCartButton = ({ product, onCartUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // User is logged in - use API
      setLoading(true);
      const res = await addToCartAPI({
        product_id: product.id,
        quantity: 1
      });
      setLoading(false);

      if (res.success) {
        alert(`✅ ${product.name} added to cart!`);
        // Dispatch custom event so Header/Cart can update
        window.dispatchEvent(new Event("cartUpdated"));
        if (onCartUpdate) onCartUpdate();
      } else {
        alert(`❌ Error: ${res.error}`);
      }
    } else {
      // Guest user - use localStorage
      addToLocalCart(product);
      if (onCartUpdate) onCartUpdate(getCartCount());
    }
  };

  return (
    <button
      className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
      onClick={handleAdd}
      disabled={loading}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
