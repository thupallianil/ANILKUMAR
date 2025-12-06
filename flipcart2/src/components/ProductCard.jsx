import { Link } from "react-router-dom";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover mb-3 rounded"
        />
        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">{product.name}</h3>
      </Link>
      <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
      <p className="text-yellow-500 mt-1">{product.rating}★</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
