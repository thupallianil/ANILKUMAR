// Get current cart from localStorage
export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

// Get cart count
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

// Add product to cart
export const addToCart = (product) => {
  const cart = getCart();

  // Check if product already exists
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Dispatch custom event so Header can update count immediately
  window.dispatchEvent(new Event("cartUpdated"));

  alert(`${product.name} added to cart!`);
};

// Remove product from cart
export const removeFromCart = (id) => {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Dispatch custom event
  window.dispatchEvent(new Event("cartUpdated"));
};
