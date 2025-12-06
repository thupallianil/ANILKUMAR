"""
Script to add more products to fill all subcategories
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth.models import User
from app.models import Product

# Get or create a seller user
try:
    seller = User.objects.get(username='seller')
except User.DoesNotExist:
    seller = User.objects.create_user('seller', 'seller@example.com', 'seller123')
    seller.is_staff = True
    seller.save()

# Products to add - organized by category and subcategory
PRODUCTS = [
    # Electronics - Smartphones
    {'name': 'OnePlus 12', 'description': 'Flagship killer with Snapdragon 8 Gen 3', 'price': 64999, 'category': 'electronics', 'subcategory': 'smartphones', 'stock': 30, 'image': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'},
    {'name': 'Google Pixel 8', 'description': 'AI-powered smartphone with best camera', 'price': 75999, 'category': 'electronics', 'subcategory': 'smartphones', 'stock': 25, 'image': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'},
    
    # Electronics - Laptops
    {'name': 'Lenovo ThinkPad X1', 'description': 'Business ultrabook with Intel Core i7', 'price': 149000, 'category': 'electronics', 'subcategory': 'laptops', 'stock': 12, 'image': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400'},
    {'name': 'ASUS ROG Zephyrus', 'description': 'Gaming laptop with RTX 4080', 'price': 189000, 'category': 'electronics', 'subcategory': 'laptops', 'stock': 8, 'image': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'},
    
    # Electronics - Headphones
    {'name': 'Sony WH-1000XM5', 'description': 'Industry-leading noise cancellation', 'price': 29990, 'category': 'electronics', 'subcategory': 'headphones', 'stock': 40, 'image': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'},
    {'name': 'Apple AirPods Pro 2', 'description': 'Active noise cancellation earbuds', 'price': 24900, 'category': 'electronics', 'subcategory': 'headphones', 'stock': 50, 'image': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400'},
    {'name': 'Bose QuietComfort Ultra', 'description': 'Premium over-ear headphones', 'price': 34990, 'category': 'electronics', 'subcategory': 'headphones', 'stock': 25, 'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'},
    {'name': 'JBL Tune 770NC', 'description': 'Wireless noise-cancelling headphones', 'price': 7999, 'category': 'electronics', 'subcategory': 'headphones', 'stock': 60, 'image': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'},
    
    # Electronics - Smart Watches
    {'name': 'Apple Watch Series 9', 'description': 'Advanced health monitoring', 'price': 41900, 'category': 'electronics', 'subcategory': 'smart watches', 'stock': 35, 'image': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400'},
    {'name': 'Samsung Galaxy Watch 6', 'description': 'Wear OS smartwatch', 'price': 28999, 'category': 'electronics', 'subcategory': 'smart watches', 'stock': 30, 'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'},
    {'name': 'Garmin Fenix 7', 'description': 'Premium GPS sports watch', 'price': 59990, 'category': 'electronics', 'subcategory': 'smart watches', 'stock': 15, 'image': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400'},
    
    # Fashion - Men's Clothing
    {'name': 'Allen Solly Formal Shirt', 'description': 'Cotton formal shirt for men', 'price': 1499, 'category': 'fashion', 'subcategory': "men's clothing", 'stock': 100, 'image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'},
    {'name': 'Peter England Blazer', 'description': 'Slim fit blazer for men', 'price': 4999, 'category': 'fashion', 'subcategory': "men's clothing", 'stock': 40, 'image': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400'},
    {'name': 'US Polo T-Shirt', 'description': 'Casual cotton polo t-shirt', 'price': 999, 'category': 'fashion', 'subcategory': "men's clothing", 'stock': 150, 'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'},
    
    # Fashion - Women's Clothing
    {'name': 'Zara Summer Dress', 'description': 'Floral print maxi dress', 'price': 2999, 'category': 'fashion', 'subcategory': "women's clothing", 'stock': 60, 'image': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'},
    {'name': 'H&M Denim Jacket', 'description': 'Classic denim jacket for women', 'price': 2499, 'category': 'fashion', 'subcategory': "women's clothing", 'stock': 45, 'image': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'},
    {'name': 'Forever 21 Crop Top', 'description': 'Trendy casual crop top', 'price': 799, 'category': 'fashion', 'subcategory': "women's clothing", 'stock': 80, 'image': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'},
    
    # Fashion - Shoes
    {'name': 'Puma Running Shoes', 'description': 'Lightweight running shoes', 'price': 5499, 'category': 'fashion', 'subcategory': 'shoes', 'stock': 70, 'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'},
    {'name': 'Clarks Formal Shoes', 'description': 'Premium leather formal shoes', 'price': 6999, 'category': 'fashion', 'subcategory': 'shoes', 'stock': 35, 'image': 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400'},
    {'name': 'Adidas Superstar', 'description': 'Classic white sneakers', 'price': 7999, 'category': 'fashion', 'subcategory': 'shoes', 'stock': 55, 'image': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400'},
    
    # Fashion - Accessories
    {'name': 'Tommy Hilfiger Belt', 'description': 'Genuine leather belt', 'price': 2499, 'category': 'fashion', 'subcategory': 'accessories', 'stock': 90, 'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'},
    {'name': 'Ray-Ban Aviator', 'description': 'Classic aviator sunglasses', 'price': 8999, 'category': 'fashion', 'subcategory': 'accessories', 'stock': 50, 'image': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400'},
    {'name': 'Fossil Leather Wallet', 'description': 'Premium bi-fold wallet', 'price': 2999, 'category': 'fashion', 'subcategory': 'accessories', 'stock': 75, 'image': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'},
    
    # Appliances - Refrigerators
    {'name': 'LG 260L Double Door', 'description': 'Frost-free refrigerator', 'price': 28990, 'category': 'appliances', 'subcategory': 'refrigerators', 'stock': 15, 'image': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'},
    {'name': 'Whirlpool 190L Single Door', 'description': 'Direct cool refrigerator', 'price': 14990, 'category': 'appliances', 'subcategory': 'refrigerators', 'stock': 20, 'image': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400'},
    
    # Appliances - Washing Machines
    {'name': 'Samsung 7kg Front Load', 'description': 'Eco bubble technology', 'price': 29990, 'category': 'appliances', 'subcategory': 'washing machines', 'stock': 18, 'image': 'https://images.unsplash.com/photo-1626806787461-102c1bb42a3b?w=400'},
    {'name': 'IFB 6.5kg Top Load', 'description': 'Fully automatic washing machine', 'price': 18990, 'category': 'appliances', 'subcategory': 'washing machines', 'stock': 22, 'image': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400'},
    
    # Appliances - Microwaves
    {'name': 'LG 28L Convection', 'description': 'Microwave with convection', 'price': 13990, 'category': 'appliances', 'subcategory': 'microwaves', 'stock': 30, 'image': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400'},
    {'name': 'Samsung 23L Solo', 'description': 'Solo microwave oven', 'price': 7990, 'category': 'appliances', 'subcategory': 'microwaves', 'stock': 40, 'image': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400'},
    {'name': 'IFB 30L Convection', 'description': 'Rotisserie microwave', 'price': 16990, 'category': 'appliances', 'subcategory': 'microwaves', 'stock': 25, 'image': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400'},
    
    # Appliances - Air Conditioners
    {'name': 'Daikin 1.5 Ton Split AC', 'description': '5-star inverter AC', 'price': 45990, 'category': 'appliances', 'subcategory': 'air conditioners', 'stock': 12, 'image': 'https://images.unsplash.com/photo-1631567091196-08d50e8c4e22?w=400'},
    {'name': 'Voltas 1 Ton Window AC', 'description': '3-star window AC', 'price': 26990, 'category': 'appliances', 'subcategory': 'air conditioners', 'stock': 18, 'image': 'https://images.unsplash.com/photo-1631567091196-08d50e8c4e22?w=400'},
    {'name': 'Blue Star 1.5 Ton', 'description': 'Inverter split AC', 'price': 42990, 'category': 'appliances', 'subcategory': 'air conditioners', 'stock': 10, 'image': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400'},
    
    # Beauty - Makeup
    {'name': 'MAC Ruby Woo Lipstick', 'description': 'Iconic red matte lipstick', 'price': 1950, 'category': 'beauty', 'subcategory': 'makeup', 'stock': 100, 'image': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'},
    {'name': 'Maybelline Fit Me Foundation', 'description': 'Matte + poreless foundation', 'price': 499, 'category': 'beauty', 'subcategory': 'makeup', 'stock': 80, 'image': 'https://images.unsplash.com/photo-1631214524020-7e18db7f7e5c?w=400'},
    {'name': 'NYX Eye Shadow Palette', 'description': '16 shade eye shadow palette', 'price': 1299, 'category': 'beauty', 'subcategory': 'makeup', 'stock': 60, 'image': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'},
    
    # Beauty - Skincare
    {'name': 'The Ordinary Niacinamide', 'description': 'Niacinamide 10% + Zinc serum', 'price': 599, 'category': 'beauty', 'subcategory': 'skincare', 'stock': 150, 'image': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'},
    {'name': 'Cetaphil Moisturizer', 'description': 'Daily hydrating lotion', 'price': 899, 'category': 'beauty', 'subcategory': 'skincare', 'stock': 120, 'image': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'},
    {'name': 'Neutrogena Sunscreen SPF50', 'description': 'Ultra sheer dry-touch', 'price': 599, 'category': 'beauty', 'subcategory': 'skincare', 'stock': 100, 'image': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'},
    
    # Beauty - Haircare
    {'name': 'LOreal Paris Shampoo', 'description': 'Total repair 5 shampoo', 'price': 399, 'category': 'beauty', 'subcategory': 'haircare', 'stock': 200, 'image': 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400'},
    {'name': 'Tresemme Conditioner', 'description': 'Keratin smooth conditioner', 'price': 349, 'category': 'beauty', 'subcategory': 'haircare', 'stock': 180, 'image': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400'},
    {'name': 'Moroccanoil Hair Oil', 'description': 'Argan oil treatment', 'price': 2999, 'category': 'beauty', 'subcategory': 'haircare', 'stock': 50, 'image': 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400'},
    
    # Beauty - Fragrances
    {'name': 'Dior Sauvage', 'description': 'Fresh and bold fragrance for men', 'price': 8500, 'category': 'beauty', 'subcategory': 'fragrances', 'stock': 40, 'image': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'},
    {'name': 'Chanel No. 5', 'description': 'Classic floral fragrance for women', 'price': 12500, 'category': 'beauty', 'subcategory': 'fragrances', 'stock': 30, 'image': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'},
    {'name': 'Park Avenue Signature', 'description': 'Everyday cologne for men', 'price': 499, 'category': 'beauty', 'subcategory': 'fragrances', 'stock': 100, 'image': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400'},
]

def add_products():
    """Add products to the database"""
    added = 0
    skipped = 0
    
    for product_data in PRODUCTS:
        # Check if product already exists
        if Product.objects.filter(name=product_data['name']).exists():
            print(f"Skipped (exists): {product_data['name']}")
            skipped += 1
            continue
        
        # Create product
        Product.objects.create(
            seller=seller,
            **product_data
        )
        print(f"Added: {product_data['name']} -> {product_data['subcategory']}")
        added += 1
    
    print(f"\nDone! Added {added} products, Skipped {skipped} existing products")

if __name__ == '__main__':
    add_products()
