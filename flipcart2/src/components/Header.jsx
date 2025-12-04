import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { searchProducts, getCart as getCartAPI } from "../utils/apiMethods";
import { User } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  // State
  const [cartCount, setCartCount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(
    () => JSON.parse(localStorage.getItem("loggedInUser")) || null
  );
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchDone, setSearchDone] = useState(false);

  // Cart count updater
  const updateCartCount = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // User is logged in - fetch from API
      const res = await getCartAPI();
      if (res.success && res.data && res.data.items) {
        const count = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } else {
      // Guest user - use localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);


  // User logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  // Switch between buyer and seller
  const toggleRole = () => {
    if (!loggedInUser) return;
    const newRole = loggedInUser.role === "buyer" ? "seller" : "buyer";
    const updatedUser = { ...loggedInUser, role: newRole };
    setLoggedInUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    navigate(newRole === "seller" ? "/seller" : "/");
  };

  // Live search effect (API-based)
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      setSearchDone(false);
      return;
    }

    // API search
    const performSearch = async () => {
      const res = await searchProducts(query);
      if (res.success && res.data && res.data.results) {
        // API returned paginated results
        setSearchResults(res.data.results);
      } else if (res.success && Array.isArray(res.data)) {
        // API returned array directly
        setSearchResults(res.data);
      } else {
        // No results from API
        setSearchResults([]);
      }
      setSearchDone(true);
    };

    performSearch();
  }, [searchQuery]);

  return (
    <>
      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          closeModal={() => setShowAuth(false)}
          onLogin={(user) => {
            setLoggedInUser(user);
            setShowAuth(false);
          }}
        />
      )}

      {/* Header */}
      <header className="bg-gray-500 p-3 flex flex-col md:flex-row items-start md:items-center justify-between relative gap-3 md:gap-0">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images.png"
            alt="Logo"
            className="w-14 h-14 object-cover rounded-full hover:scale-105 transition-transform"
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-4 relative w-full">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-100 bg-white text-gray-800 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-blue-500
                       hover:shadow-md transition-shadow"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>

          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 max-h-96 overflow-y-auto rounded-b-lg mt-1">
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="bg-white p-2 rounded-lg shadow hover:shadow-lg transition-shadow text-center cursor-pointer hover:scale-105"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-md mb-1"
                    />
                    <h3 className="text-gray-800 font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-gray-500 text-xs">{item.category}</p>
                    <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && searchDone && searchResults.length === 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 p-4 rounded-b-lg text-center text-gray-600 mt-1">
              ❌ Product not available
            </div>
          )}
        </div>

        {/* User & Cart Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 text-white font-medium relative w-full md:w-auto">
          {/* Login/User */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {loggedInUser ? (
              <button className="bg-white text-blue-600 px-4 py-1 rounded-md">{loggedInUser.username}</button>
            ) : (
              <button onClick={() => setShowAuth(true)} className="bg-white text-blue-600 px-4 py-1 rounded-md">
                Login
              </button>
            )}

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-300 text-gray-700 rounded-lg shadow-lg p-4 z-50">
                {!loggedInUser && (
                  <div className="border-b pb-3 mb-3">
                    <p className="text-sm">
                      New customer?{" "}
                      <button onClick={() => setShowAuth(true)} className="text-blue-600 font-semibold">
                        Sign Up
                      </button>
                    </p>
                  </div>
                )}

                {loggedInUser && (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
                      <Link to="/profile" className="flex items-center gap-2">
                        <User size={18} /> My Profile
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Seller/Buyer Section & Cart */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 text-white font-medium relative w-full md:w-auto">
            {/* Seller/Buyer Dashboard & Switch */}
            {loggedInUser && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                {loggedInUser.role === "seller" && (
                  <div className="bg-purple-100 p-3 rounded-lg text-sm">
                    <h3 className="text-purple-700 font-semibold mb-1">Seller Overview</h3>
                    <p className="text-gray-700">
                      Welcome, <span className="font-semibold text-pink-500">{loggedInUser.username}</span>! Manage your products in{" "}
                      <Link to="/seller" className="text-purple-600 font-semibold hover:underline">Seller Dashboard</Link>.
                    </p>
                  </div>
                )}

                <button
                  onClick={toggleRole}
                  className="mt-3 bg-yellow-400 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all w-full md:w-auto"
                >
                  Switch to {loggedInUser.role === "buyer" ? "Seller" : "Buyer"} Mode
                </button>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative bg-white text-blue-600 px-4 py-1 rounded-md">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 rounded-full">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
