import React, { useState, useEffect } from "react";
import { getOrders, updateProfile, getProfile, logout as logoutAPI } from "../utils/apiMethods";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("loggedInUser")) || {});
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getOrders();
    if (res.success) {
      setOrders(res.data);
    } else {
      console.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
      role: user.role || "buyer",
    };
    
    const res = await updateProfile(payload);
    
    if (res.success) {
      // Update local state immediately
      const updatedUser = {
        ...user,
        ...payload
      };
      setUser(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      
      // Fetch fresh profile data from backend
      const profileRes = await getProfile();
      if (profileRes.success) {
        const freshUser = {
          ...updatedUser,
          ...profileRes.data
        };
        setUser(freshUser);
        localStorage.setItem("loggedInUser", JSON.stringify(freshUser));
      }
      
      alert("✅ Profile updated successfully!");
      setIsEditing(false);
    } else {
      alert(`❌ Error: ${res.error}`);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutAPI();
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  if (!user.username) {
    return (
      <div className="p-4 text-center">
        <p>Please log in first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Profile Header Section */}
        <div className="relative mb-12">
          {/* Background Banner */}
          <div className="absolute inset-0 h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-90 blur-xl"></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative w-40 h-40 md:w-48 md:h-48">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="User Avatar"
                    className="w-full h-full rounded-full shadow-2xl border-4 border-indigo-500 object-cover"
                  />
                  <div className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                  {user.username}
                </h1>
                <p className="text-lg text-gray-600 mb-2 flex items-center justify-center md:justify-start gap-2">
                  <span>✉️</span> {user.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
                  <span>👤</span> Account Type: <span className="font-semibold text-indigo-600 uppercase">{user.role || "buyer"}</span>
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 md:flex-col md:items-end">
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{orders.length}</p>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-pink-600">
                    ₹{orders.reduce((sum, order) => sum + (order.total_price || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Information Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <span>📋</span> {isEditing ? "Edit Profile" : "Profile Information"}
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition font-semibold flex items-center gap-2 shadow-lg"
                >
                  <span>✏️</span> Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Personal Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "Username", name: "username", type: "text", icon: "👤" },
                    { label: "Email", name: "email", type: "email", icon: "📧" },
                    { label: "Phone", name: "phone", type: "text", icon: "📱" },
                    { label: "Pincode", name: "pincode", type: "text", icon: "📍" },
                  ].map((field, index) => (
                    <div key={index}>
                      <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <span>{field.icon}</span> {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={user[field.name] || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-50 disabled:text-gray-600 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Address Details</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {[
                    { label: "City", name: "city", type: "text", icon: "🏙️" },
                    { label: "State", name: "state", type: "text", icon: "🗺️" },
                  ].map((field, index) => (
                    <div key={index}>
                      <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <span>{field.icon}</span> {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={user[field.name] || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-50 disabled:text-gray-600 transition"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span>🏠</span> Full Address
                  </label>
                  <textarea
                    name="address"
                    value={user.address || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    rows="4"
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-75 transition font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span> Saving...
                      </>
                    ) : (
                      <>
                        <span>✅</span> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 transition font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>❌</span> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="space-y-6">
            {/* Stats Box */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span>Total Orders</span>
                  <span className="text-2xl font-bold">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span>Total Spent</span>
                  <span className="text-2xl font-bold">₹{orders.reduce((sum, order) => sum + (order.total_price || 0), 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span>Account Type</span>
                  <span className="text-lg font-bold capitalize">{user.role || "buyer"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isEditing && (
                <>
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Orders Section */}
        {!loading && orders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2 pb-6 border-b-2 border-gray-100">
              <span>📦</span> My Orders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-indigo-500 transition duration-300 bg-gradient-to-br from-gray-50 to-white"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-xl text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        📅 {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="my-4 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-3xl font-bold text-indigo-600">₹{order.total_price}</p>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Items:</p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex justify-between">
                            <span className="truncate">{item.product?.name}</span>
                            <span className="ml-2 font-semibold">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty Orders State */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <p className="text-6xl mb-4">🛍️</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your order history here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
