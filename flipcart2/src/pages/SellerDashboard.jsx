// src/Pages/SellerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Package, BarChart3, PlusCircle, ShoppingBag, Users, LogOut, Edit2, Trash2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct, getOrders } from "../utils/apiMethods";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || { username: "Seller", email: "" }
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  });

  useEffect(() => {
    document.title = "Seller Dashboard | Flipkart Clone";
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch products
    const productsRes = await getProducts({ limit: 100 });
    if (productsRes.success) {
      setProducts(productsRes.data.results || productsRes.data);
    }

    // Fetch orders
    const ordersRes = await getOrders();
    if (ordersRes.success) {
      setOrders(ordersRes.data.results || ordersRes.data);
    }
    
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      image: formData.image || "https://via.placeholder.com/150"
    };

    console.log("Creating product payload:", payload);
    const res = await createProduct(payload);
    console.log("Create product response:", res);
    setLoading(false);

    if (res.success) {
      alert("✅ Product added successfully!");
      setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" });
      fetchData();
    } else {
      // Build a detailed error message when serializer returns field errors
      let errorMsg = res.error || "Unknown error";
      if (res.data && typeof res.data === 'object') {
        const parts = [];
        for (const [key, val] of Object.entries(res.data)) {
          // val may be array of messages
          if (Array.isArray(val)) parts.push(`${key}: ${val.join('; ')}`);
          else parts.push(`${key}: ${String(val)}`);
        }
        if (parts.length) errorMsg = parts.join(' | ');
      }
      console.error("Create product error:", errorMsg, res.data);
      alert(`❌ Error: ${errorMsg}`);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "",
      stock: product.stock || 0,
      image: product.image || ""
    });
    setActiveTab("addProduct");
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      image: formData.image || "https://via.placeholder.com/150"
    };

    console.log("Updating product id:", editingProduct, "payload:", payload);
    const res = await updateProduct(editingProduct, payload);
    console.log("Update product response:", res);
    setLoading(false);

    if (res.success) {
      alert("✅ Product updated successfully!");
      setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" });
      setEditingProduct(null);
      fetchData();
    } else {
      let errorMsg = res.error || "Unknown error";
      if (res.data && typeof res.data === 'object') {
        const parts = [];
        for (const [key, val] of Object.entries(res.data)) {
          if (Array.isArray(val)) parts.push(`${key}: ${val.join('; ')}`);
          else parts.push(`${key}: ${String(val)}`);
        }
        if (parts.length) errorMsg = parts.join(' | ');
      }
      console.error("Update product error:", errorMsg, res.data);
      alert(`❌ Error: ${errorMsg}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      const res = await deleteProduct(productId);
      setLoading(false);

      if (res.success) {
        alert("✅ Product deleted successfully!");
        fetchData();
      } else {
        alert(`❌ Error: ${res.error}`);
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-center text-yellow-400">
          Seller Panel
        </h2>

        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
              activeTab === "overview"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-800"
            }`}
          >
            <BarChart3 size={20} /> Overview
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
              activeTab === "products"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-800"
            }`}
          >
            <Package size={20} /> My Products
          </button>

          <button
            onClick={() => setActiveTab("addProduct")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
              activeTab === "addProduct"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-800"
            }`}
          >
            <PlusCircle size={20} /> Add Product
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
              activeTab === "orders"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-800"
            }`}
          >
            <ShoppingBag size={20} /> Orders
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
              activeTab === "customers"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-800"
            }`}
          >
            <Users size={20} /> Customers
          </button>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {activeTab === "overview" && (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-blue-800">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <h2 className="text-gray-500 mb-2">Total Products</h2>
                <p className="text-3xl font-bold text-blue-800">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <h2 className="text-gray-500 mb-2">Total Orders</h2>
                <p className="text-3xl font-bold text-green-600">{orders.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <h2 className="text-gray-500 mb-2">Total Revenue</h2>
                <p className="text-3xl font-bold text-yellow-500">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Orders Summary */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Recent Orders</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="p-3 text-left">Order ID</th>
                      <th className="p-3 text-left">Total</th>
                      <th className="p-3 text-left">Items</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">#{order.id}</td>
                        <td className="p-3">₹{order.total_price?.toLocaleString()}</td>
                        <td className="p-3">{order.items?.length || 0} items</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-blue-800">My Products ({products.length})</h1>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" });
                  setActiveTab("addProduct");
                }}
                className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                <PlusCircle size={20} /> Add Product
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                    <img
                      src={product.image || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-blue-700 font-bold">₹{product.price?.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600 mb-4">No products yet. Add your first product!</p>
                <button
                  onClick={() => setActiveTab("addProduct")}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Add Product
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "addProduct" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-blue-800">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h1>
            <form
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              className="bg-white p-6 rounded-lg shadow-md max-w-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter price"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="appliances">Appliances</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter stock quantity"
                    required
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter product description"
                    rows="3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter image link"
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-3 h-32 rounded-lg object-cover" />
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 transition font-semibold"
                >
                  {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" });
                      setActiveTab("products");
                    }}
                    className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-blue-800">My Orders ({orders.length})</h1>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="p-3 text-left">Order ID</th>
                      <th className="p-3 text-left">Total Amount</th>
                      <th className="p-3 text-left">Items</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 font-semibold text-blue-700">#{order.id}</td>
                        <td className="p-3 font-bold">₹{order.total_price?.toLocaleString()}</td>
                        <td className="p-3">{order.items?.length || 0} items</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">No orders yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "customers" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-blue-800">Order Customers ({orders.length})</h1>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading customers...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-3">
                  {Array.from(new Set(orders.map(o => JSON.stringify(o.user || { id: o.id, username: 'Customer' })))).map((user) => {
                    const userData = JSON.parse(user);
                    return (
                      <div key={userData.id} className="border-b pb-3 last:border-b-0 hover:bg-gray-50 p-3 rounded transition">
                        <p className="font-semibold text-gray-800">{userData.username || userData.first_name || "Customer"}</p>
                        <p className="text-sm text-gray-600">{userData.email || "N/A"}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">No customers yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
