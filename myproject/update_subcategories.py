"""
Script to update existing products with subcategories
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from app.models import Product

# Define product to subcategory mappings based on product names
SUBCATEGORY_MAPPINGS = {
    # Electronics subcategories
    'MacBook': 'laptops',
    'Dell XPS': 'laptops',
    'HP Spectre': 'laptops',
    'Laptop': 'laptops',
    'iPhone': 'smartphones',
    'Samsung Galaxy': 'smartphones',
    'Phone': 'smartphones',
    'Headphones': 'headphones',
    'Earbuds': 'headphones',
    'AirPods': 'headphones',
    'Watch': 'smart watches',
    'Apple Watch': 'smart watches',
    
    # Fashion subcategories
    "Men's": "men's clothing",
    "Men Shirt": "men's clothing",
    "Men T-Shirt": "men's clothing",
    "Women's": "women's clothing",
    "Women Dress": "women's clothing",
    'Dress': "women's clothing",
    'Shoe': 'shoes',
    'Sneaker': 'shoes',
    'Boot': 'shoes',
    'Bag': 'accessories',
    'Belt': 'accessories',
    'Sunglasses': 'accessories',
    
    # Appliances subcategories
    'Refrigerator': 'refrigerators',
    'Fridge': 'refrigerators',
    'Washing Machine': 'washing machines',
    'Washer': 'washing machines',
    'Microwave': 'microwaves',
    'Oven': 'microwaves',
    'Air Conditioner': 'air conditioners',
    'AC ': 'air conditioners',
    
    # Beauty subcategories
    'Makeup': 'makeup',
    'Lipstick': 'makeup',
    'Foundation': 'makeup',
    'Mascara': 'makeup',
    'Skincare': 'skincare',
    'Moisturizer': 'skincare',
    'Serum': 'skincare',
    'Face Cream': 'skincare',
    'Shampoo': 'haircare',
    'Conditioner': 'haircare',
    'Hair': 'haircare',
    'Perfume': 'fragrances',
    'Cologne': 'fragrances',
    'Fragrance': 'fragrances',
}

def update_product_subcategories():
    """Update products with subcategories based on their names"""
    products = Product.objects.all()
    updated_count = 0
    
    for product in products:
        if product.subcategory:
            print(f"Skipping {product.name} - already has subcategory: {product.subcategory}")
            continue
            
        # Try to find a matching subcategory
        for keyword, subcategory in SUBCATEGORY_MAPPINGS.items():
            if keyword.lower() in product.name.lower() or keyword.lower() in product.description.lower():
                product.subcategory = subcategory
                product.save()
                print(f"Updated {product.name} -> {subcategory}")
                updated_count += 1
                break
        else:
            print(f"No match found for: {product.name} (category: {product.category})")
    
    print(f"\n✅ Updated {updated_count} products with subcategories")

if __name__ == '__main__':
    update_product_subcategories()
