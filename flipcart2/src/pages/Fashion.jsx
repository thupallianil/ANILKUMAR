// src/Pages/Fashion.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AddToCartButton from "../components/AddToCartButton";
import { getProducts } from "../utils/apiMethods";

const Fashion = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFashion();
  }, []);

  const fetchFashion = async () => {
    setLoading(true);
    const res = await getProducts({ category: 'fashion' });
    if (res.success) {
      const productList = res.data.results || res.data || [];
      setProducts(productList);
    } else {
      console.error("Failed to fetch fashion products:", res.error);
      setProducts([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Fashion</h2>
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-3 rounded"
                />
                <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description?.substring(0, 50)}...</p>
                <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>
                <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
                <AddToCartButton product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fashion;
