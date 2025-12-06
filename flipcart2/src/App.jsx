// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MyProfile from "./components/MyProfile";

// Pages
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Electronics from "./pages/Electronics";
import Fashion from "./pages/Fashion";
import Beauty from "./pages/Beauty";
import Appliances from "./pages/Appliances";
import SellerDashboard from "./pages/SellerDashboard";

// Protected Route Component for Seller
const SellerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user?.role === "seller" ? children : <Navigate to="/" replace />;
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <Router>
      {showWelcome ? (
        <Welcome onFinish={() => setShowWelcome(false)} />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header />

          {/* Navbar with Category Dropdowns */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Product Details */}
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* Category Pages */}
              <Route path="/products/Electronics" element={<Electronics />} />
              <Route path="/products/Electronics/:subcategory" element={<Electronics />} />

              <Route path="/products/Fashion" element={<Fashion />} />
              <Route path="/products/Fashion/:subcategory" element={<Fashion />} />

              <Route path="/products/Beauty" element={<Beauty />} />
              <Route path="/products/Beauty/:subcategory" element={<Beauty />} />

              <Route path="/products/Appliances" element={<Appliances />} />
              <Route path="/products/Appliances/:subcategory" element={<Appliances />} />

              {/* Cart / Checkout / About */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />

              {/* Profile */}
              <Route path="/profile" element={<MyProfile />} />

              {/* Seller Dashboard (protected) */}
              <Route
                path="/seller"
                element={
                  <SellerRoute>
                    <SellerDashboard />
                  </SellerRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      )}
    </Router>
  );
}

export default App;
