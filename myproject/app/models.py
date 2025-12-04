from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
	CATEGORY_ELECTRONICS = 'electronics'
	CATEGORY_FASHION = 'fashion'
	CATEGORY_BEAUTY = 'beauty'
	CATEGORY_APPLIANCES = 'appliances'

	CATEGORY_CHOICES = [
		(CATEGORY_ELECTRONICS, 'Electronics'),
		(CATEGORY_FASHION, 'Fashion'),
		(CATEGORY_BEAUTY, 'Beauty'),
		(CATEGORY_APPLIANCES, 'Appliances'),
	]

	seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products', null=True, blank=True)
	name = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	price = models.DecimalField(max_digits=10, decimal_places=2)
	category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True)
	stock = models.IntegerField(default=0)
	image = models.URLField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.name} ({self.seller.username})"


class Cart(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"Cart of {self.user.username}"


class CartItem(models.Model):
	cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.CASCADE)
	quantity = models.IntegerField(default=1)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('cart', 'product')

	def __str__(self):
		return f"{self.product.name} x {self.quantity} in {self.cart.user.username}'s cart"


class Order(models.Model):
	STATUS_PENDING = 'pending'
	STATUS_COMPLETED = 'completed'
	STATUS_CANCELLED = 'cancelled'

	STATUS_CHOICES = [
		(STATUS_PENDING, 'Pending'),
		(STATUS_COMPLETED, 'Completed'),
		(STATUS_CANCELLED, 'Cancelled'),
	]

	PAYMENT_COD = 'cod'
	PAYMENT_CARD = 'card'
	PAYMENT_UPI = 'upi'
	PAYMENT_EMI = 'emi'

	PAYMENT_CHOICES = [
		(PAYMENT_COD, 'Cash on Delivery'),
		(PAYMENT_CARD, 'Credit/Debit Card'),
		(PAYMENT_UPI, 'UPI'),
		(PAYMENT_EMI, 'EMI'),
	]

	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
	total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
	payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default=PAYMENT_COD, blank=True)
	shipping_address = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"Order #{self.id} by {self.user.username}"


class OrderItem(models.Model):
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
	quantity = models.IntegerField(default=1)
	price = models.DecimalField(max_digits=10, decimal_places=2)

	def __str__(self):
		return f"{self.product.name} x {self.quantity} in Order #{self.order.id}"

