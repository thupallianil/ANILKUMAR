"""
Script to populate the database with sample products
Run with: python manage.py shell < populate_products.py
"""

from django.contrib.auth.models import User
from app.models import Product

# Create or get seller user
seller, created = User.objects.get_or_create(
    username='seller',
    defaults={'is_staff': True}
)
if created:
    seller.set_password('seller123')
    seller.save()
    print("✅ Created seller user (username: seller, password: seller123)")
else:
    seller.is_staff = True
    seller.save()
    print("✅ Found existing seller user")

# Sample products data
products_data = [
    # Electronics
    {'name': 'MacBook Air M2', 'description': 'Latest Apple laptop with M2 chip, 8GB RAM, 256GB SSD', 'price': 130000, 'category': 'electronics', 'stock': 10, 'image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300'},
    {'name': 'Dell XPS 15', 'description': 'Premium Windows laptop, Intel i7, 16GB RAM, 512GB SSD', 'price': 145000, 'category': 'electronics', 'stock': 15, 'image': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300'},
    {'name': 'HP Spectre x360', 'description': 'Convertible 2-in-1 laptop with touchscreen', 'price': 125000, 'category': 'electronics', 'stock': 8, 'image': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300'},
    {'name': 'iPhone 15 Pro', 'description': 'Latest iPhone with A17 Pro chip, 128GB', 'price': 134900, 'category': 'electronics', 'stock': 20, 'image': 'https://images.unsplash.com/photo-1592286927505-4fd2194d9b7d?w=300'},
    {'name': 'Samsung Galaxy S24', 'description': 'Flagship Android phone, 256GB storage', 'price': 79999, 'category': 'electronics', 'stock': 25, 'image': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300'},
    {'name': 'Sony WH-1000XM5', 'description': 'Premium noise-cancelling headphones', 'price': 29990, 'category': 'electronics', 'stock': 30, 'image': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300'},
    
    # Fashion
    {'name': 'Nike Air Max', 'description': 'Comfortable running shoes for men', 'price': 8999, 'category': 'fashion', 'stock': 50, 'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'},
    {'name': 'Levis Jeans', 'description': 'Classic 501 Original Fit Jeans', 'price': 3499, 'category': 'fashion', 'stock': 40, 'image': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300'},
    {'name': 'Adidas T-Shirt', 'description': 'Cotton sports t-shirt, breathable fabric', 'price': 1299, 'category': 'fashion', 'stock': 60, 'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'},
    
    # Home & Appliances
    {'name': 'Samsung Refrigerator', 'description': '253L Double Door Frost Free', 'price': 24990, 'category': 'appliances', 'stock': 12, 'image': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300'},
    {'name': 'LG Washing Machine', 'description': '7kg Fully Automatic Front Load', 'price': 32990, 'category': 'appliances', 'stock': 10, 'image': 'https://images.unsplash.com/photo-1626806787461-102c1bb42a3b?w=300'},
    {'name': 'Dyson Vacuum Cleaner', 'description': 'Cordless stick vacuum with powerful suction', 'price': 34990, 'category': 'appliances', 'stock': 15, 'image': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300'},
    
    # Beauty
    {'name': 'Lakme Lipstick', 'description': 'Matte finish long-lasting lipstick', 'price': 399, 'category': 'beauty', 'stock': 100, 'image': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300'},
    {'name': 'Maybelline Mascara', 'description': 'Volumizing mascara for fuller lashes', 'price': 599, 'category': 'beauty', 'stock': 80, 'image': 'https://images.unsplash.com/photo-1631214524020-7e18db7f7e5c?w=300'},
    {'name': 'Nivea Face Cream', 'description': 'Daily moisturizing cream for all skin types', 'price': 299, 'category': 'beauty', 'stock': 120, 'image': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300'},
]

# Create products
created_count = 0
for product_data in products_data:
    product, created = Product.objects.get_or_create(
        name=product_data['name'],
        defaults={
            'seller': seller,
            'description': product_data['description'],
            'price': product_data['price'],
            'category': product_data['category'],
            'stock': product_data['stock'],
            'image': product_data['image']
        }
    )
    if created:
        created_count += 1
        print(f"✅ Created: {product_data['name']} (₹{product_data['price']})")
    else:
        print(f"⚠️  Already exists: {product_data['name']}")

print(f"\n🎉 Complete! Created {created_count} new products.")
print(f"📊 Total products in database: {Product.objects.count()}")
print("\n🔗 View products at: http://127.0.0.1:8000/api/products/")
