// src/Pages/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, getProducts, addToCart as addToCartAPI } from "../utils/apiMethods";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const res = await getProduct(id);
    if (res.success) {
      setProduct(res.data);
      // Fetch related products from same category
      const relatedRes = await getProducts({ category: res.data.category });
      if (relatedRes.success) {
        setRelatedProducts(relatedRes.data.filter(p => p.id !== res.data.id));
      }
    } else {
      console.error("Failed to fetch product");
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to add items to cart");
      return;
    }

    const res = await addToCartAPI({ product_id: product.id, quantity: 1 });
    if (res.success) {
      alert(`${product.name} added to cart!`);
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <p>Product not found!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain border p-2 rounded-lg"
          />
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="space-y-2 mb-6">
            <p><strong>Category:</strong> {product.category}</p>
            {product.subcategory && (
              <p><strong>Subcategory:</strong> {product.subcategory}</p>
            )}
            <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
            <p className="text-gray-600">{product.description}</p>
            <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="border p-3 rounded-lg hover:shadow-lg transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-contain mb-2"
                />
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-sm text-green-600 font-semibold">₹{p.price}</p>
                {p.stock === 0 && <p className="text-xs text-red-600">Out of stock</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

