// src/Pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../Data/products";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const ProductsPage = () => {
  const { category, subcategory } = useParams();

  const filteredProducts = products.filter(
    (p) =>
      p.category === decodeURIComponent(category) &&
      p.subcategory === decodeURIComponent(subcategory)
  );

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100">
      <Header cartCount={cartCount} />
      <Navbar />

      <div className="p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
          {decodeURIComponent(category)} / {decodeURIComponent(subcategory)}
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
              >
                <Link to={`/product/${p.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 text-white">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <p className="font-bold text-blue-400 text-sm">₹{p.price}</p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => addToCart(p)}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-b-xl hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg mt-4">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
