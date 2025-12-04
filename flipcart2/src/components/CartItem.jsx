import React from "react";

const CartItem = ({ item, removeItem, updateQuantity }) => {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p>₹{item.price} x {item.quantity}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-2 bg-gray-300 rounded"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-2 bg-gray-300 rounded"
        >
          +
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-500 ml-4"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
