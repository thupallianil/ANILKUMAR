import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

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
    print("Created seller user (username: seller, password: seller123)")
else:
    seller.is_staff = True
    seller.save()
    print("Found existing seller user")

# Sample products data
products_data = [
    {'name': 'MacBook Air M2', 'description': 'Latest Apple laptop with M2 chip', 'price': 130000, 'category': 'electronics', 'stock': 10, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Dell XPS 15', 'description': 'Premium Windows laptop', 'price': 145000, 'category': 'electronics', 'stock': 15, 'image': 'https://via.placeholder.com/300'},
    {'name': 'HP Spectre x360', 'description': 'Convertible laptop', 'price': 125000, 'category': 'electronics', 'stock': 8, 'image': 'https://via.placeholder.com/300'},
    {'name': 'iPhone 15 Pro', 'description': 'Latest iPhone with A17 Pro chip', 'price': 134900, 'category': 'electronics', 'stock': 20, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Samsung Galaxy S24', 'description': 'Flagship Android phone', 'price': 79999, 'category': 'electronics', 'stock': 25, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Sony Headphones', 'description': 'Premium noise-cancelling headphones', 'price': 29990, 'category': 'electronics', 'stock': 30, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Nike Air Max', 'description': 'Comfortable running shoes', 'price': 8999, 'category': 'fashion', 'stock': 50, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Levis Jeans', 'description': 'Classic 501 Original Fit Jeans', 'price': 3499, 'category': 'fashion', 'stock': 40, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Adidas T-Shirt', 'description': 'Cotton sports t-shirt', 'price': 1299, 'category': 'fashion', 'stock': 60, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Samsung Refrigerator', 'description': '253L Double Door Frost Free', 'price': 24990, 'category': 'appliances', 'stock': 12, 'image': 'https://via.placeholder.com/300'},
    {'name': 'LG Washing Machine', 'description': '7kg Fully Automatic', 'price': 32990, 'category': 'appliances', 'stock': 10, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Dyson Vacuum', 'description': 'Cordless stick vacuum', 'price': 34990, 'category': 'appliances', 'stock': 15, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Lakme Lipstick', 'description': 'Matte finish long-lasting', 'price': 399, 'category': 'beauty', 'stock': 100, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Maybelline Mascara', 'description': 'Volumizing mascara', 'price': 599, 'category': 'beauty', 'stock': 80, 'image': 'https://via.placeholder.com/300'},
    {'name': 'Nivea Face Cream', 'description': 'Daily moisturizing cream', 'price': 299, 'category': 'beauty', 'stock': 120, 'image': 'https://via.placeholder.com/300'},
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
        print(f"Created: {product_data['name']} (Rs.{product_data['price']})")
    else:
        print(f"Already exists: {product_data['name']}")

print(f"\nComplete! Created {created_count} new products.")
print(f"Total products in database: {Product.objects.count()}")
print("\nView products at: http://127.0.0.1:8000/api/products/")
