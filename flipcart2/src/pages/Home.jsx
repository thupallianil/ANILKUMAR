// src/Pages/Home.jsx
import React, { useState, useEffect } from "react";
import { getProducts, addToCart as addToCartAPI } from "../utils/apiMethods";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";

// Banner Carousel Component
const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const banners = [
    {
      id: 1,
      image: "/electronics.jpg",
      alt: "Electronics Sale",
      title: "MEGA ELECTRONICS SALE",
      subtitle: "Up to 70% OFF"
    },
    {
      id: 2,
      image: "/fashion.jpg",
      alt: "Fashion Sale",
      title: "FASHION FIESTA",
      subtitle: "New Arrivals & Trending Styles"
    },
    {
      id: 3,
      image: "/home.jpg",
      alt: "Home Appliances",
      title: "HOME ESSENTIALS",
      subtitle: "Smart Living Starts Here"
    },
    {
      id: 4,
      image: "/games.jpg",
      alt: "Gaming Zone",
      title: "GAME ON!",
      subtitle: "Ultimate Gaming Experience"
    },
    {
      id: 5,
      image: "beauty.jpg",
      alt: "Beauty Products",
      title: "BEAUTY BONANZA",
      subtitle: "Glow Up Your Style"
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 4000); // Auto-rotate every 4 seconds
      return () => clearInterval(timer);
    }
  }, [isPaused, banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <div
      className="relative w-full h-80 mt-4 overflow-hidden rounded-xl shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Images */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={banner.image}
            alt={banner.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous banner"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next banner"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
              ? "w-8 h-3 bg-white"
              : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

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

      {/* Banner Carousel */}
      <BannerCarousel />

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