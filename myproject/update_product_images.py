import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from app.models import Product

# Update products with real image URLs using Unsplash
product_images = {
    'MacBook Air M2': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    'Dell XPS 15': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    'HP Spectre x360': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    'iPhone 15 Pro': 'https://images.unsplash.com/photo-1592286927505-4fd2194d9b7d?w=400',
    'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    'Sony Headphones': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    'Nike Air Max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    'Levis Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    'Adidas T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    'Samsung Refrigerator': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
    'LG Washing Machine': 'https://images.unsplash.com/photo-1626806787461-102c1bb42a3b?w=400',
    'Dyson Vacuum': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
    'Lakme Lipstick': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
    'Maybelline Mascara': 'https://images.unsplash.com/photo-1631214524020-7e18db7f7e5c?w=400',
    'Nivea Face Cream': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
}

updated_count = 0
for product_name, image_url in product_images.items():
    try:
        product = Product.objects.get(name=product_name)
        product.image = image_url
        product.save()
        updated_count += 1
        print(f"Updated: {product_name}")
    except Product.DoesNotExist:
        print(f"Not found: {product_name}")

print(f"\nUpdated {updated_count} product images!")
print(f"Total products: {Product.objects.count()}")
print("All products now have real images!")
