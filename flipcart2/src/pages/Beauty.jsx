// src/pages/Beauty.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { getProducts } from "../utils/apiMethods";

const Beauty = () => {
  const { subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [subcategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { category: "Beauty" };
      if (subcategory) {
        params.subcategory = subcategory;
      }

      const res = await getProducts(params);
      if (res.success) {
        setProducts(res.data.results || res.data || []);
      } else {
        console.error("Failed to fetch products:", res.error);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Beauty & Personal Care {subcategory && <span className="text-purple-600">› {subcategory}</span>}
        </h2>
        {subcategory && (
          <Link to="/products/Beauty" className="text-purple-500 hover:underline text-sm mt-1 inline-block">
            ← View All Beauty
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="ml-4 text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available in this category.</p>
          <Link to="/products/Beauty" className="text-purple-600 hover:underline mt-2 inline-block">
            Browse All Beauty
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <Link to={`/product/${product.id}`} className="w-full">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-3 rounded hover:opacity-90 transition-opacity"
                />
              </Link>
              <Link to={`/product/${product.id}`}>
                <h3 className="text-lg font-semibold text-center hover:text-purple-600 transition-colors">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600 mt-1 text-center">{product.description?.substring(0, 50)}...</p>
              <p className="text-purple-600 font-bold mt-2 text-lg">₹{product.price}</p>
              <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
              <div className="mt-3 w-full">
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Beauty;
