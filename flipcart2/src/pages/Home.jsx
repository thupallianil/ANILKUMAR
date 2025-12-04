// src/Pages/Home.jsx
import React, { useState, useEffect } from "react";
import { getProducts, addToCart as addToCartAPI } from "../utils/apiMethods";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    price: 100000,
    category: "",
    brand: "",
    discount: "",
    type: "",
    newArrival: false,
    offers: false,
    fit: "",
    occasion: "",
    availability: "",
    rating: 1,
  });

  // Load products from API on mount
  useEffect(() => {
    fetchProducts();
    loadCartCount();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.price) params.max_price = filters.price;
    
    const res = await getProducts(params);
    if (res.success) {
      setProducts(res.data);
    } else {
      console.error("Failed to fetch products:", res.error);
      // Fallback to empty array
      setProducts([]);
    }
    setLoading(false);
  };

  const loadCartCount = () => {
    const isLoggedIn = localStorage.getItem("authToken");
    if (isLoggedIn) {
      // Cart is managed by the backend - will show in cart page
      setCartCount(0);
    } else {
      // Use local storage for guests
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }
  };

  const addToCart = async (product) => {
    const isLoggedIn = localStorage.getItem("authToken");
    
    if (isLoggedIn) {
      // Use API to add to cart
      const res = await addToCartAPI({ product_id: product.id, quantity: 1 });
      if (res.success) {
        alert(`${product.name} added to cart!`);
        loadCartCount();
      } else {
        alert(`Error: ${res.error}`);
      }
    } else {
      // Use local storage for guests
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find((item) => item.id === product.id);
      if (existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
      alert(`${product.name} added to cart!`);
    }
  };

  // Apply client-side filters for non-API attributes
  const filteredProducts = products.filter((p) => {
    if (p.price > filters.price) return false;
    if (filters.rating && p.rating < filters.rating) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <Header cartCount={cartCount} />

      {/* Navbar */}
      <Navbar />

      {/* Banner Image */}
      <div className="w-full h-64 mt-4">
        <img
          src="/image3.jpg"
          alt="Big Sale Banner"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Main Section */}
      <div className="flex p-4 gap-4 mt-4">
        {/* Filters Sidebar */}
        <Filters filters={filters} setFilters={setFilters} />

        {/* Products Grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products match your filters.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home; 