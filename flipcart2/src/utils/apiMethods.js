import apiClient from '../config/axiosInstance';
import API_ENDPOINTS from '../config/api';

// Standardized response wrapper
async function handleRequest(promise) {
  try {
    const res = await promise;
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    // normalize error
    const status = err.response?.status || null;
    const data = err.response?.data || null;
    const message = data?.error || data?.detail || (err.message || 'Unknown error');
    return { success: false, error: message, data, status };
  }
}

// Generic CRUD wrappers
export const apiGet = (url, config = {}) => handleRequest(apiClient.get(url, config));
export const apiPost = (url, body = {}, config = {}) => handleRequest(apiClient.post(url, body, config));
export const apiPut = (url, body = {}, config = {}) => handleRequest(apiClient.put(url, body, config));
export const apiPatch = (url, body = {}, config = {}) => handleRequest(apiClient.patch(url, body, config));
export const apiDelete = (url, config = {}) => handleRequest(apiClient.delete(url, config));

// Auth
export async function register({ username, email, password }) {
  return apiPost(API_ENDPOINTS.REGISTER, { username, email, password });
}

export async function login({ username, password }) {
  return apiPost(API_ENDPOINTS.LOGIN, { username, password });
}

export async function logout() {
  return apiPost(API_ENDPOINTS.LOGOUT);
}

export async function getProfile() {
  return apiGet(API_ENDPOINTS.PROFILE);
}

export async function updateProfile(payload) {
  return apiPut(API_ENDPOINTS.PROFILE, payload);
}

// Products
export async function getProducts(params = {}) {
  return apiGet(API_ENDPOINTS.PRODUCTS, { params });
}

export async function searchProducts(searchTerm, filters = {}) {
  // searchTerm searches in name and description
  const params = {
    search: searchTerm,
    ...filters  // Merge in category, min_price, max_price, etc.
  };
  return apiGet(API_ENDPOINTS.PRODUCTS, { params });
}


export async function getProduct(id) {
  return apiGet(API_ENDPOINTS.PRODUCT_DETAIL(id));
}

export async function createProduct(payload) {
  return apiPost(API_ENDPOINTS.PRODUCTS, payload);
}

export async function updateProduct(id, payload) {
  return apiPut(API_ENDPOINTS.PRODUCT_DETAIL(id), payload);
}

export async function deleteProduct(id) {
  return apiDelete(API_ENDPOINTS.PRODUCT_DETAIL(id));
}

// Cart
export async function getCart() {
  return apiGet(API_ENDPOINTS.CART);
}

export async function addToCart({ product_id, quantity = 1 }) {
  return apiPost(API_ENDPOINTS.CART, { product_id, quantity });
}

export async function updateCartItem({ product_id, quantity }) {
  return apiPatch(API_ENDPOINTS.CART, { product_id, quantity });
}

export async function removeFromCart({ product_id }) {
  return apiDelete(API_ENDPOINTS.CART, { data: { product_id } });
}

// Orders
export async function getOrders() {
  return apiGet(API_ENDPOINTS.ORDERS);
}

export async function createOrder(payload) {
  return apiPost(API_ENDPOINTS.ORDERS, payload);
}

export async function getOrder(id) {
  return apiGet(API_ENDPOINTS.ORDER_DETAIL(id));
}

export async function updateOrder(id, payload) {
  return apiPut(API_ENDPOINTS.ORDER_DETAIL(id), payload);
}

export async function deleteOrder(id) {
  return apiDelete(API_ENDPOINTS.ORDER_DETAIL(id));
}

// Usage examples (copy into components):
// import { login, register, getProducts, addToCart } from '../utils/apiMethods';
// const res = await login({ username: 'user', password: 'pass' });
// if (res.success) { localStorage.setItem('authToken', res.data.token); }

export default {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  // auth
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  // products
  getProducts,
  searchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  // cart
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  // orders
  getOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
};
