// API configuration for frontend
export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/products/`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/products/${id}/`,

  // Users
  REGISTER: `${API_BASE_URL}/users/register/`,
  LOGIN: `${API_BASE_URL}/users/login/`,
  LOGOUT: `${API_BASE_URL}/users/logout/`,
  PROFILE: `${API_BASE_URL}/users/profile/`,

  // Cart
  CART: `${API_BASE_URL}/cart/`,

  // Orders
  ORDERS: `${API_BASE_URL}/orders/`,
  ORDER_DETAIL: (id) => `${API_BASE_URL}/orders/${id}/`,
};

export default API_ENDPOINTS;
