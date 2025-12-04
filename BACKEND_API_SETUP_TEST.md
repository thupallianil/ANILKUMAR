# Backend API Setup & Test Guide

## Backend is Ready!

The Django REST API is fully implemented with:
- **Auth**: Register, Login, Logout, Profile (Token-based)
- **Products**: List, Create (sellers only), Retrieve, Update, Delete
- **Cart**: Get, Add item, Update quantity, Remove item
- **Orders**: List, Create (from cart), Retrieve, Update

---

## 1. Setup & Run Backend

### Step 1: Create Virtual Environment
```powershell
cd 'c:\Users\Gutha Gowthami\Desktop\ANILKUMAR\myproject'
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### Step 2: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 3: Run Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

### Step 4: Create a Superuser (for Django Admin + Testing)
```powershell
python manage.py createsuperuser
# Enter username, email, password
```

### Step 5: Make one user a seller (for testing Add Product)
```powershell
python manage.py shell
# Then in the shell:
from django.contrib.auth.models import User
seller = User.objects.get(username='your_seller_username')  # or create: User.objects.create_user(username='seller', password='pass1234', is_staff=True)
seller.is_staff = True
seller.save()
exit()
```

### Step 6: Start Backend Server
```powershell
python manage.py runserver
```
✅ Backend runs at: **http://localhost:8000/api**

---

## 2. Setup & Run Frontend

### Step 1: Install Dependencies
```powershell
cd 'c:\Users\Gutha Gowthami\Desktop\ANILKUMAR\flipcart2'
npm install
```

### Step 2: Start Frontend Dev Server
```powershell
npm run dev
```
✅ Frontend runs at: **http://localhost:5173**

---

## 3. Manual API Test Flows (Use Postman or Browser DevTools)

### Test Flow 1: User Signup
**Endpoint**: `POST /api/users/register/`
**URL**: `http://localhost:8000/api/users/register/`
**Headers**: `Content-Type: application/json`
**Body**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "pass1234"
}
```
**Expected Response** (201):
```json
{
  "token": "abc123xyz...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```
✅ Save the token for next steps.

---

### Test Flow 2: User Login
**Endpoint**: `POST /api/users/login/`
**URL**: `http://localhost:8000/api/users/login/`
**Headers**: `Content-Type: application/json`
**Body**:
```json
{
  "username": "testuser",
  "password": "pass1234"
}
```
**Expected Response** (200):
```json
{
  "token": "abc123xyz...",
  "user": { ... }
}
```

---

### Test Flow 3: Get User Profile
**Endpoint**: `GET /api/users/profile/`
**URL**: `http://localhost:8000/api/users/profile/`
**Headers**: 
- `Authorization: Token abc123xyz...`
- `Content-Type: application/json`

**Expected Response** (200):
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "first_name": "",
  "last_name": ""
}
```

---

### Test Flow 4: Update User Profile
**Endpoint**: `PUT /api/users/profile/`
**URL**: `http://localhost:8000/api/users/profile/`
**Headers**: 
- `Authorization: Token abc123xyz...`
- `Content-Type: application/json`
**Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```
**Expected Response** (200): Updated user data

---

### Test Flow 5: Get All Products (No Auth Needed)
**Endpoint**: `GET /api/products/`
**URL**: `http://localhost:8000/api/products/`
**Headers**: `Content-Type: application/json`

**Expected Response** (200):
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

---

### Test Flow 6: Create a Product (Seller Only)
**Endpoint**: `POST /api/products/`
**URL**: `http://localhost:8000/api/products/`
**Headers**: 
- `Authorization: Token seller_token_here`
- `Content-Type: application/json`
**Body**:
```json
{
  "name": "iPhone 15",
  "description": "Latest Apple phone",
  "price": 999.99,
  "category": "electronics",
  "stock": 50,
  "image": "https://via.placeholder.com/300"
}
```
**Expected Response** (201):
```json
{
  "id": 1,
  "seller": { "id": 2, "username": "seller", ... },
  "name": "iPhone 15",
  "price": "999.99",
  "category": "electronics",
  "stock": 50,
  "image": "https://via.placeholder.com/300",
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

**Note**: Non-sellers get 403 Forbidden.

---

### Test Flow 7: Get Cart
**Endpoint**: `GET /api/cart/`
**URL**: `http://localhost:8000/api/cart/`
**Headers**: 
- `Authorization: Token user_token_here`
- `Content-Type: application/json`

**Expected Response** (200):
```json
{
  "id": 1,
  "user": 1,
  "items": [],
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

---

### Test Flow 8: Add Item to Cart
**Endpoint**: `POST /api/cart/`
**URL**: `http://localhost:8000/api/cart/`
**Headers**: 
- `Authorization: Token user_token_here`
- `Content-Type: application/json`
**Body**:
```json
{
  "product_id": 1,
  "quantity": 2
}
```
**Expected Response** (200):
```json
{
  "id": 1,
  "product": { "id": 1, "name": "iPhone 15", ... },
  "product_id": 1,
  "quantity": 2,
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

---

### Test Flow 9: Update Cart Item Quantity
**Endpoint**: `PATCH /api/cart/`
**URL**: `http://localhost:8000/api/cart/`
**Headers**: 
- `Authorization: Token user_token_here`
- `Content-Type: application/json`
**Body**:
```json
{
  "product_id": 1,
  "quantity": 5
}
```
**Expected Response** (200): Updated cart item

---

### Test Flow 10: Remove Item from Cart
**Endpoint**: `DELETE /api/cart/`
**URL**: `http://localhost:8000/api/cart/`
**Headers**: 
- `Authorization: Token user_token_here`
- `Content-Type: application/json`
**Body**:
```json
{
  "product_id": 1
}
```
**Expected Response** (200):
```json
{
  "detail": "Item removed"
}
```

---

### Test Flow 11: Create Order (Checkout from Cart)
**Endpoint**: `POST /api/orders/`
**URL**: `http://localhost:8000/api/orders/`
**Headers**: 
- `Authorization: Token user_token_here`
- `Content-Type: application/json`
**Body**: `{}` (empty, as order is created from cart items)

**Expected Response** (201):
```json
{
  "id": 1,
  "user": { "id": 1, "username": "testuser", ... },
  "total_price": "1999.98",
  "status": "pending",
  "items": [
    {
      "id": 1,
      "product": { ... },
      "quantity": 2,
      "price": "999.99"
    }
  ],
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

---

### Test Flow 12: Get User Orders
**Endpoint**: `GET /api/orders/`
**URL**: `http://localhost:8000/api/orders/`
**Headers**: 
- `Authorization: Token user_token_here`
- `Content-Type: application/json`

**Expected Response** (200):
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [ { order details... } ]
}
```

---

## 4. Testing in Browser

### Frontend Test Steps:
1. Open **http://localhost:5173** in browser
2. Click "Sign Up" and create a new account
3. After signup, token is saved in `localStorage`
4. Navigate to different pages (Home, Products, Cart, Checkout, Profile)
5. Open **DevTools (F12) → Network tab** to see API calls
6. Open **DevTools → Console** to see logs and debug messages

### Seller Test Steps (Add/Edit/Delete Products):
1. Create a seller account via Django admin or shell (set `is_staff=True`)
2. Login as seller in frontend
3. Navigate to Seller Dashboard
4. Try to add a product (should succeed if `is_staff=True`)
5. Edit and delete products
6. Check **Network tab** to see API response (watch for validation errors)

---

## 5. Troubleshooting

### Issue: `ModuleNotFoundError: No module named 'rest_framework'`
**Solution**: Run `pip install -r requirements.txt`

### Issue: `CORS error: Access-Control-Allow-Origin`
**Solution**: Backend CORS is configured for `http://localhost:5173`. Make sure frontend runs on that port (check `npm run dev` output).

### Issue: `Token authentication failed / 401 Unauthorized`
**Solution**: Check `Authorization` header is `Token <token_key>` (not `Bearer`). Check token is valid by logging in again.

### Issue: `403 Forbidden` on POST /products/
**Solution**: User is not a seller. Set `is_staff=True` via Django admin or shell for the user account.

### Issue: Frontend can't reach backend
**Solution**: Backend must run on `http://localhost:8000`. Check `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `settings.py`.

---

## 6. Next Steps

After backend is running and frontend API calls work:
1. Test all flows in browser (signup, login, add to cart, checkout, profile update)
2. Check **DevTools Network** and **Console** for any errors
3. Make note of any validation errors or missing endpoints
4. The agent can help debug or add additional features

Happy testing! 🚀
