# Search Bar API Integration ✅

## What Was Added

The search bar in the Header now uses the backend API to search products in real-time.

---

## Backend Search API

**Endpoint:** `GET /api/products/`

**Query Parameters:**
- `search` — Search term (searches in product name and description)
- `category` — Filter by category (electronics, fashion, beauty, appliances)
- `min_price` — Filter by minimum price
- `max_price` — Filter by maximum price

**Example Requests:**

```bash
# Search for "iPhone"
GET /api/products/?search=iphone

# Search in electronics category with price range
GET /api/products/?search=phone&category=electronics&min_price=10000&max_price=50000

# Filter by category only
GET /api/products/?category=fashion

# Price range filter only
GET /api/products/?min_price=1000&max_price=5000
```

**Response Example:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "iPhone 15",
      "description": "Latest Apple smartphone",
      "price": "99999.00",
      "category": "electronics",
      "stock": 10,
      "image": "https://...",
      "seller": { "id": 2, "username": "seller1", ... },
      "created_at": "2025-12-04T...",
      "updated_at": "2025-12-04T..."
    }
  ]
}
```

---

## Frontend Search Function

**Location:** `src/utils/apiMethods.js`

**Function:**
```javascript
export async function searchProducts(searchTerm, filters = {}) {
  // searchTerm searches in name and description
  const params = {
    search: searchTerm,
    ...filters  // Merge in category, min_price, max_price, etc.
  };
  return apiGet(API_ENDPOINTS.PRODUCTS, { params });
}
```

**Usage Examples:**

```javascript
import { searchProducts } from '../utils/apiMethods';

// Simple search
const res = await searchProducts('iphone');
if (res.success) {
  console.log('Results:', res.data.results);
}

// Search with filters
const res = await searchProducts('phone', {
  category: 'electronics',
  min_price: 5000,
  max_price: 50000
});

// Just filter (no search term)
const res = await searchProducts('', {
  category: 'fashion'
});
```

---

## How It Works

### In Header Component (`src/components/Header.jsx`)

1. User types in search bar
2. `useEffect` triggers with search query
3. Calls `searchProducts(query)` from backend API
4. If API returns results, displays them
5. If API fails or returns empty, falls back to localStorage search (for offline support)
6. Click on result navigates to product details page (`/product/{id}`)

### Search Flow

```
User types → API search() → Backend filters products → Frontend displays results → Click result → Go to product page
```

---

## Testing the Search Bar

1. Start backend and frontend (see QUICKSTART.md)
2. Open http://localhost:5173
3. Type in search bar at top:
   - Try "iphone" → should show matching products
   - Try "electronics" → should show category matches
   - Try partial name → should find matches
4. Results appear instantly as you type
5. Click a result to view product details

---

## Advanced Filtering Example

To add a filter component (e.g., category selector), use the `searchProducts` function:

```javascript
const [selectedCategory, setSelectedCategory] = useState('');
const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

const handleFilter = async () => {
  const filters = {
    ...(selectedCategory && { category: selectedCategory }),
    ...(priceRange.min > 0 && { min_price: priceRange.min }),
    ...(priceRange.max < 100000 && { max_price: priceRange.max })
  };
  
  const res = await searchProducts('', filters);
  if (res.success) {
    setProducts(res.data.results || res.data);
  }
};
```

---

## API Parameters Summary

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | string | "iphone" | Search in name/description (case-insensitive) |
| `category` | string | "electronics" | Exact category match |
| `min_price` | float | "5000" | Minimum product price |
| `max_price` | float | "50000" | Maximum product price |

---

## Notes

- Search is **case-insensitive**
- Search checks both **name and description**
- Multiple filters work together (AND logic)
- Results include seller information
- Category values must match backend choices (lowercase): `electronics`, `fashion`, `beauty`, `appliances`
- Frontend has fallback search using localStorage if backend is unavailable

---

## Integration Points

- **Header.jsx** — Search bar with API integration
- **apiMethods.js** — `searchProducts()` wrapper function
- **views.py** — Backend ProductListCreateView with Q filtering
- **API endpoint** — GET `/api/products/?search=...&category=...&min_price=...&max_price=...`

All wired and ready to use! 🚀
