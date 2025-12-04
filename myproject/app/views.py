from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied

from .serializers import (
	UserSerializer, RegisterSerializer, ProductSerializer,
	CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer
)
from .models import Product, Cart, CartItem, Order, OrderItem


class APIRootView(APIView):
	"""API Root endpoint - lists all available endpoints"""
	permission_classes = [permissions.AllowAny]

	def get(self, request):
		return Response({
			'message': 'Welcome to the E-commerce API',
			'version': '1.0',
			'endpoints': {
				'auth': {
					'register': '/api/users/register/',
					'login': '/api/users/login/',
					'logout': '/api/users/logout/',
					'profile': '/api/users/profile/',
				},
				'products': {
					'list': '/api/products/',
					'detail': '/api/products/<id>/',
					'search': '/api/products/?search=<query>',
					'filter_by_category': '/api/products/?category=<category>',
				},
				'cart': {
					'get_cart': 'GET /api/cart/',
					'add_item': 'POST /api/cart/',
					'update_item': 'PATCH /api/cart/',
					'remove_item': 'DELETE /api/cart/',
				},
				'orders': {
					'list': '/api/orders/',
					'create': 'POST /api/orders/',
					'detail': '/api/orders/<id>/',
				}
			},
			'documentation': 'See BACKEND_API_SETUP_TEST.md for detailed API documentation'
		})



class RegisterView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request, *args, **kwargs):
		serializer = RegisterSerializer(data=request.data)
		if serializer.is_valid():
			user = serializer.save()
			token, _ = Token.objects.get_or_create(user=user)
			return Response({
				'token': token.key,
				'user': UserSerializer(user).data
			}, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request, *args, **kwargs):
		username = request.data.get('username')
		password = request.data.get('password')
		user = authenticate(username=username, password=password)
		if user:
			token, _ = Token.objects.get_or_create(user=user)
			return Response({'token': token.key, 'user': UserSerializer(user).data})
		return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, *args, **kwargs):
		# Delete token to log out
		Token.objects.filter(user=request.user).delete()
		return Response({'detail': 'Logged out'})

class ProfileView(generics.RetrieveUpdateAPIView):
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_object(self):
		return self.request.user

class ProductListCreateView(generics.ListCreateAPIView):
	serializer_class = ProductSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

	def get_queryset(self):
		queryset = Product.objects.all().order_by('-created_at')
		
		# Search by name or description
		search = self.request.query_params.get('search', None)
		if search:
			queryset = queryset.filter(
				Q(name__icontains=search) | 
				Q(description__icontains=search)
			)
		
		# Filter by category
		category = self.request.query_params.get('category', None)
		if category:
			queryset = queryset.filter(category=category)
		
		# Filter by price range
		min_price = self.request.query_params.get('min_price', None)
		max_price = self.request.query_params.get('max_price', None)
		if min_price:
			queryset = queryset.filter(price__gte=float(min_price))
		if max_price:
			queryset = queryset.filter(price__lte=float(max_price))
		
		return queryset

	def perform_create(self, serializer):
		# Only sellers (is_staff=True) can create products
		if not self.request.user.is_staff:
			raise PermissionDenied("Only sellers can create products.")
		serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = ProductSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]
	queryset = Product.objects.all()


class CartView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		# Get or create cart
		cart, created = Cart.objects.get_or_create(user=request.user)
		serializer = CartSerializer(cart)
		return Response(serializer.data)

	def post(self, request):
		# Add item to cart
		cart, created = Cart.objects.get_or_create(user=request.user)
		product_id = request.data.get('product_id')
		quantity = request.data.get('quantity', 1)

		try:
			product = Product.objects.get(id=product_id)
		except Product.DoesNotExist:
			return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

		cart_item, created = CartItem.objects.get_or_create(
			cart=cart,
			product=product,
			defaults={'quantity': quantity}
		)
		if not created:
			cart_item.quantity += int(quantity)
			cart_item.save()

		return Response(CartItemSerializer(cart_item).data)

	def patch(self, request):
		# Update cart item quantity
		cart = Cart.objects.get(user=request.user)
		product_id = request.data.get('product_id')
		quantity = request.data.get('quantity')

		try:
			cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
			if quantity and quantity > 0:
				cart_item.quantity = quantity
				cart_item.save()
				return Response(CartItemSerializer(cart_item).data)
			else:
				cart_item.delete()
				return Response({'detail': 'Item removed'})
		except CartItem.DoesNotExist:
			return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

	def delete(self, request):
		# Remove item from cart
		cart = Cart.objects.get(user=request.user)
		product_id = request.data.get('product_id')

		try:
			cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
			cart_item.delete()
			return Response({'detail': 'Item removed'})
		except CartItem.DoesNotExist:
			return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)


class OrderListCreateView(generics.ListCreateAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Order.objects.filter(user=self.request.user).order_by('-created_at')

	def perform_create(self, serializer):
		# Create order from cart
		user = self.request.user
		try:
			cart = Cart.objects.get(user=user)
		except Cart.DoesNotExist:
			raise Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

		# Calculate total
		total = sum(item.product.price * item.quantity for item in cart.items.all())

		# Get payment method and shipping address from request
		payment_method = self.request.data.get('payment_method', 'cod')
		shipping_address = self.request.data.get('shipping_address', '')

		# Create order
		order = Order.objects.create(
			user=user, 
			total_price=total,
			payment_method=payment_method,
			shipping_address=shipping_address
		)

		# Create order items from cart items
		for cart_item in cart.items.all():
			OrderItem.objects.create(
				order=order,
				product=cart_item.product,
				quantity=cart_item.quantity,
				price=cart_item.product.price
			)

		# Clear cart
		cart.items.all().delete()

		return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveUpdateAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Order.objects.filter(user=self.request.user)

