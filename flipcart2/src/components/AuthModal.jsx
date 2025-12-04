import React, { useState } from "react";
import { login as apiLogin, register as apiRegister } from "../utils/apiMethods";

const AuthModal = ({ closeModal, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    identifier: "",
    loginPassword: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log("Sign up attempt with:", { username: form.username, email: form.email });

    try {
      const res = await apiRegister({ username: form.username, email: form.email, password: form.password });
      console.log("Full registration response:", res);
      
      if (res.success) {
        console.log("Sign up success:", res.data);
        alert("✅ Account created successfully! Please login now.");
        setIsLogin(true);
        setForm({ username: "", email: "", password: "", identifier: "", loginPassword: "" });
      } else {
        let errorMsg = res.error || "Registration failed. Please try again.";
        
        // Handle validation errors from backend
        if (res.data && typeof res.data === 'object') {
          if (res.data.username && Array.isArray(res.data.username)) {
            errorMsg = res.data.username[0];
          } else if (res.data.email && Array.isArray(res.data.email)) {
            errorMsg = res.data.email[0];
          } else if (res.data.password && Array.isArray(res.data.password)) {
            errorMsg = res.data.password[0];
          } else {
            errorMsg = JSON.stringify(res.data);
          }
        }
        
        console.error("Sign up error:", errorMsg);
        setError(errorMsg);
        alert(`❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error("Sign up exception:", err);
      setError("Network error or server not responding");
      alert("❌ Network error. Make sure the backend server is running on http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log("Login attempt with:", { username: form.identifier });

    try {
      const res = await apiLogin({ username: form.identifier, password: form.loginPassword });
      console.log("Full login response:", res);
      
      if (res.success) {
        console.log("Login success:", res.data);
        const userData = {
          user_id: res.data.user?.id,
          username: res.data.user?.username,
          email: res.data.user?.email,
          role: res.data.user?.is_staff ? 'seller' : 'buyer',
        };

        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        if (res.data.token) {
          localStorage.setItem("authToken", res.data.token);
          console.log("Token stored successfully");
        }

        console.log("Token stored:", res.data.token);
        alert("✅ Successfully logged in!");
        if (onLogin) onLogin(userData);
        closeModal();
      } else {
        let errorMsg = res.error || "Invalid credentials! Please try again.";
        
        // Handle backend error messages
        if (res.data && typeof res.data === 'object') {
          if (res.data.error) {
            errorMsg = res.data.error;
          } else if (res.data.detail) {
            errorMsg = res.data.detail;
          }
        }
        
        console.error("Login error:", errorMsg);
        setError(errorMsg);
        alert(`❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("Network error or server not responding");
      alert("❌ Network error. Make sure the backend server is running on http://localhost:8000");
    } finally {
      setLoading(false);
      setForm({ ...form, identifier: "", loginPassword: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-gold-300 bg-gold-200 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={closeModal}>✕</button>
        {isLogin ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                required
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={form.loginPassword}
                onChange={(e) => setForm({ ...form, loginPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
              New here? <button onClick={() => { setIsLogin(false); setError(""); }} className="text-blue-600 font-semibold">Sign Up</button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleSignup} className="space-y-4">
              <input 
                type="text" 
                placeholder="Username" 
                required 
                value={form.username} 
                onChange={(e) => setForm({ ...form, username: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
              Already have an account? <button onClick={() => { setIsLogin(true); setError(""); }} className="text-blue-600 font-semibold">Login</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;