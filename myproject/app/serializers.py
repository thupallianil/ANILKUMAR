from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Cart, CartItem, Order, OrderItem



class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'first_name', 'last_name')


class RegisterSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, required=True, min_length=6)

	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'password')

	def create(self, validated_data):
		user = User(username=validated_data['username'], email=validated_data.get('email', ''))
		user.set_password(validated_data['password'])
		user.save()
		return user


class ProductSerializer(serializers.ModelSerializer):
	seller = UserSerializer(read_only=True)

	class Meta:
		model = Product
		fields = ('id', 'seller', 'name', 'description', 'price', 'category', 'stock', 'image', 'created_at', 'updated_at')


class CartItemSerializer(serializers.ModelSerializer):
	product = ProductSerializer(read_only=True)
	product_id = serializers.IntegerField(write_only=True)

	class Meta:
		model = CartItem
		fields = ('id', 'product', 'product_id', 'quantity', 'created_at', 'updated_at')


class CartSerializer(serializers.ModelSerializer):
	items = CartItemSerializer(many=True, read_only=True)

	class Meta:
		model = Cart
		fields = ('id', 'user', 'items', 'created_at', 'updated_at')


class OrderItemSerializer(serializers.ModelSerializer):
	product = ProductSerializer(read_only=True)

	class Meta:
		model = OrderItem
		fields = ('id', 'product', 'quantity', 'price')


class OrderSerializer(serializers.ModelSerializer):
	items = OrderItemSerializer(many=True, read_only=True)
	user = UserSerializer(read_only=True)

	class Meta:
		model = Order
		fields = ('id', 'user', 'total_price', 'status', 'payment_method', 'shipping_address', 'items', 'created_at', 'updated_at')

