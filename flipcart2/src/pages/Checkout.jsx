// src/Pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { createOrder, getCart as getCartAPI } from "../utils/apiMethods";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: ""
  });
  const [emiPlan, setEmiPlan] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const emiPlans = [
    { months: 3, interest: 5 },
    { months: 6, interest: 8 },
    { months: 12, interest: 12 },
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to proceed with checkout");
      navigate("/");
      return;
    }
    setIsLoggedIn(true);
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    setLoading(true);
    const res = await getCartAPI();
    if (res.success) {
      // res.data is the cart object with items property
      const cartData = res.data;
      const items = cartData.items || [];
      setCart(items);
      const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      setTotalAmount(total);
    } else {
      alert("Failed to load cart");
    }
    setLoading(false);
  };

  const calculateEmi = (months, interest) => {
    const rate = interest / 100;
    return ((totalAmount + totalAmount * rate) / months).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.address || !form.city || !form.state || !form.pincode) {
      alert("Please fill in all address fields");
      return;
    }

    if (!form.payment) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);
    const shippingAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

    const res = await createOrder({
      shipping_address: shippingAddress,
      payment_method: form.payment
    });
    setLoading(false);

    if (res.success) {
      alert("✅ Order placed successfully!");
      navigate("/myprofile");
    } else {
      alert(`❌ Error: ${res.error}`);
    }
  };

  if (!isLoggedIn) {
    return <div className="p-4">Redirecting to login...</div>;
  }

  if (loading && cart.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      <Header cartCount={cart.length} />

      <main className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Cart Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2 pb-2 border-b">
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">₹{item.product?.price} x {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.product?.price || 0) * item.quantity}</p>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-lg font-bold">Total: ₹{totalAmount}</p>
                </div>
              </>
            )}
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="City"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="State"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Pincode"
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                required
                value={form.payment}
                onChange={(e) => setForm({ ...form, payment: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Method</option>
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="emi">EMI</option>
              </select>

              {form.payment === "emi" && (
                <div className="border p-3 rounded bg-gray-50">
                  <h4 className="font-semibold mb-2">Choose EMI Plan</h4>
                  {emiPlans.map((plan) => (
                    <label key={plan.months} className="block mb-2">
                      <input
                        type="radio"
                        name="emi"
                        value={plan.months}
                        checked={emiPlan === plan.months.toString()}
                        onChange={(e) => setEmiPlan(e.target.value)}
                        className="mr-2"
                      />
                      {plan.months} Months @ {plan.interest}% - ₹{calculateEmi(plan.months, plan.interest)}/month
                    </label>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
