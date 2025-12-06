// src/Pages/Home.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, addToCart as addToCartAPI } from "../utils/apiMethods";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";

// Banner Carousel Component
const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Using the Unsplash banner images you shared
  const banners = [
    {
      id: 1,
      title: "Big Savings on Electronics",
      subtitle: "Up to 70% OFF on Laptops, Phones & More",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
      alt: "Electronics Sale",
    },
    {
      id: 2,
      title: "Fashion Sale",
      subtitle: "Trending Styles at Unbeatable Prices",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      alt: "Fashion Sale",
    },
    {
      id: 3,
      title: "Home & Kitchen",
      subtitle: "Transform Your Space - Starting ₹199",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&q=80",
      alt: "Home & Kitchen",
    },
    {
      id: 4,
      title: "Sports & Fitness",
      subtitle: "Get Fit, Stay Healthy - Up to 60% OFF",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
      alt: "Sports & Fitness",
    },
    {
      id: 5,
      title: "Books & More",
      subtitle: "Bestsellers & New Arrivals - Extra 20% OFF",
      image:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80",
      alt: "Books & More",
    },
  ];

  // Auto-slide
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isPaused]); // banners.length is constant, no need in dependency

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
      {/* Slides */}
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
          {/* Gradient + Text overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
            <div className="px-6 md:px-12 lg:px-16 text-white max-w-xl">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                {banner.title}
              </h2>
              <p className="text-sm md:text-lg mb-4">{banner.subtitle}</p>
              <button className="px-4 py-2 md:px-6 md:py-2.5 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-300 transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next banner"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }
  };

  const addToCart = async (product) => {
    const isLoggedIn = localStorage.getItem("authToken");

    if (isLoggedIn) {
      const res = await addToCartAPI({ product_id: product.id, quantity: 1 });
      if (res.success) {
        alert(`${product.name} added to cart!`);
        loadCartCount();
      } else {
        alert(`Error: ${res.error}`);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find((item) => item.id === product.id);
      if (existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
      alert(`${product.name} added to cart!`);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (p.price > filters.price) return false;
    if (filters.rating && p.rating < filters.rating) return false;
    return true;
  });

  return (
    <div>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Main Section */}
      <div className="flex p-4 gap-4 mt-4">
        {/* Filters Sidebar */}
        <Filters filters={filters} setFilters={setFilters} />

        {/* Products Grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading products...
            </p>
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
