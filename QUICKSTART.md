# 🚀 Quick Start Guide - Frontend-Backend Integration

## TL;DR - Run These Commands

### Terminal 1: Backend
```powershell
cd 'c:\Users\Gutha Gowthami\Desktop\ANILKUMAR\myproject'
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
✅ Backend ready at: **http://localhost:8000/api**

### Terminal 2: Frontend
```powershell
cd 'c:\Users\Gutha Gowthami\Desktop\ANILKUMAR\flipcart2'
npm install
npm run dev
```
✅ Frontend ready at: **http://localhost:5173**

---

## Create a Seller (Optional - For Testing Add Product)

### Terminal 3: Create Seller Account
```powershell
cd 'c:\Users\Gutha Gowthami\Desktop\ANILKUMAR\myproject'
.venv\Scripts\Activate.ps1
python manage.py shell
```

### Inside Python Shell:
```python
from django.contrib.auth.models import User
User.objects.create_user(username='seller', password='pass1234', email='seller@test.com', is_staff=True)
exit()
```

---

## Test Checklist

- [ ] Open http://localhost:5173 in browser
- [ ] Sign up with new account → Should succeed
- [ ] Login → Token should be stored in localStorage
- [ ] Browse products on Home page → Should load from backend
- [ ] Click on a product → Should show details + "Add to Cart"
- [ ] Click "Add to Cart" → Should add to cart (cart icon updates)
- [ ] Go to Cart page → Should show cart items
- [ ] Increase/decrease quantity → Should update cart
- [ ] Click "Proceed to Checkout" → Fill form and place order
- [ ] Go to Profile → Should show order history
- [ ] **Login as seller** → Navigate to Seller Dashboard
- [ ] Click "Add Product" → Fill form with category (electronics/fashion/beauty/appliances)
- [ ] Submit → Product should appear in list

---

## API Test (Using Browser DevTools)

### Login and Get Token
1. Open DevTools (F12) → Console tab
2. Copy and paste:
```javascript
fetch('http://localhost:8000/api/users/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'testuser', password: 'pass1234' })
})
.then(r => r.json())
.then(d => {
  localStorage.setItem('authToken', d.token);
  console.log('Token saved:', d.token);
})
```

### Get Cart
```javascript
fetch('http://localhost:8000/api/cart/', {
  headers: { 'Authorization': 'Token ' + localStorage.getItem('authToken') }
})
.then(r => r.json())
.then(d => console.log('Cart:', d))
```

### Add Product to Cart
```javascript
fetch('http://localhost:8000/api/cart/', {
  method: 'POST',
  headers: {
    'Authorization': 'Token ' + localStorage.getItem('authToken'),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ product_id: 1, quantity: 2 })
})
.then(r => r.json())
.then(d => console.log('Added to cart:', d))
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Backend won't start | Make sure Python is installed, venv is activated, `pip install -r requirements.txt` is run |
| `ModuleNotFoundError` | Activate venv: `.venv\Scripts\Activate.ps1` then `pip install -r requirements.txt` |
| CORS error | Check backend is running. Check frontend URL is http://localhost:5173 |
| 401 Unauthorized | Log out (clear localStorage) and log in again |
| Product "Add" fails | Make sure you're a seller (is_staff=True) and category is lowercase |
| Cart empty | Refresh page, check if logged in, check DevTools Network `/api/cart/` response |

---

## Useful URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin (use superuser credentials)
- **DevTools Network:** F12 → Network tab (to see API calls & responses)
- **DevTools Console:** F12 → Console tab (to see logs & run JS)

---

## Debugging Tips

### Check if token is saved
```javascript
// In browser DevTools console:
localStorage.getItem('authToken')  // Should print token key
localStorage.getItem('loggedInUser')  // Should print user data
```

### Check API response in DevTools
1. Open F12 → Network tab
2. Perform an action (login, add to cart, etc.)
3. Look for the API call (e.g., `login/`, `cart/`, `products/`)
4. Click it → See Response tab for backend response
5. Check Status code (200 = success, 400 = validation error, 401 = auth error, 403 = forbidden, 500 = server error)

### Check browser console for logs
1. Open F12 → Console tab
2. Look for `console.log()` messages (errors will appear in red)
3. Copy error message for troubleshooting

### Stop everything and reset
```powershell
# Ctrl+C in all terminals to stop servers

# Optional: Reset database and migrations
cd 'c:\Users\Gutha Gowthami\Desktop\ANILKUMAR\myproject'
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
```

---

## Documentation

📖 **Full Setup & API Tests:** `BACKEND_API_SETUP_TEST.md`  
📖 **Integration Details:** `INTEGRATION_COMPLETE.md`  
📖 **File Structure & Project Overview:** See README files in each folder

---

## Next Steps (After Testing)

1. ✅ Verify all flows work (signup → login → add product → cart → checkout)
2. ✅ Check DevTools Console & Network for any errors
3. ✅ Test as both regular user and seller
4. 🔧 Fix any bugs that appear (API response handling, validation, etc.)
5. 🚀 Deploy to production (set DEBUG=False, use real database, etc.)

---

**All set! Enjoy your fully integrated e-commerce app! 🎉**
