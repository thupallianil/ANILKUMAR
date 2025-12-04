from django.urls import path
from .views import (
	APIRootView,
	RegisterView,
	LoginView,
	LogoutView,
	ProfileView,
	ProductListCreateView,
	ProductDetailView,
	CartView,
	OrderListCreateView,
	OrderDetailView,
)

urlpatterns = [
	# API Root
	path('', APIRootView.as_view(), name='api-root'),
	
	# Auth
	path('users/register/', RegisterView.as_view(), name='register'),
	path('users/login/', LoginView.as_view(), name='login'),
	path('users/logout/', LogoutView.as_view(), name='logout'),
	path('users/profile/', ProfileView.as_view(), name='profile'),

	# Products
	path('products/', ProductListCreateView.as_view(), name='products'),
	path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

	# Cart
	path('cart/', CartView.as_view(), name='cart'),

	# Orders
	path('orders/', OrderListCreateView.as_view(), name='orders'),
	path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]

