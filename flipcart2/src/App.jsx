// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import MyProfile from "./components/MyProfile";

// Pages
import Welcome from "./Pages/Welcome";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import About from "./Pages/About";
import Electronics from "./Pages/Electronics";
import Fashion from "./Pages/Fashion";
import Beauty from "./Pages/Beauty";
import Appliances from "./Pages/Appliances";
import SellerDashboard from "./Pages/SellerDashboard";

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
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Product Details */}
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* Category Pages */}
              <Route path="/products/Electronics/:subcategory" element={<Electronics />} />
              <Route path="/products/Fashion/:subcategory" element={<Fashion />} />
              <Route path="/products/Beauty/:subcategory" element={<Beauty />} />
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
