import json

from django import forms
from decimal import Decimal

from django.forms import TextInput, EmailInput
from django.shortcuts import render, redirect
from django.views.generic import ListView
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Shop, Product, Order, OrderItem


# Create a form for user information
class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['user_name', 'email', 'phone', 'address']
        widgets = {
            "user_name": TextInput(attrs={"class": "form-control", "id": "name", "name": "user_name" "required"}),
            "email": EmailInput(attrs={"class": "form-control", "id": "email", "name": "email" "required"}),
            "phone": TextInput(attrs={"type":"tel","class": "form-control", "id": "phone", "name": "phone" "required"}),
            "address": TextInput(attrs={"class": "form-control", "id": "address", "name": "address" "required"})
        }


# Shop view
class ShopsView(ListView):
    model = Shop
    template_name = 'delivery_app/shops.html'
    context_object_name = 'shops'


# To save order and show card
def card(request):
    
    # If user submit form
    if request.method == 'POST':
        
        # Check if it valid
        form = OrderForm(request.POST)
        if form.is_valid():

            # Save the order details
            order = form.save(commit=False)  

            # Save the selected products and total price
            product_data = request.POST.get('cardItems', '')
            total_price = request.POST.get('total_price')
            
            # Convert the product data from JSON to Python dictionary
            product_data = json.loads(product_data)  
            product_data_dict = {}
            for item in product_data:
                product_data_dict[item['id']] = item['quantity']
                
            # Set the total price on the order
            total_price_decimal = Decimal(total_price)
            order.total_price = total_price_decimal
            order.save()
                
            for product_id, quantity in product_data_dict.items():
                # Get the product instance
                product = Product.objects.get(id=product_id)
                
                # Create the OrderItem and associate it with the order and product
                OrderItem.objects.create(order=order, product=product, quantity=quantity)
            
            # Redirect the user to the index page
            return redirect('delivery_app:index')
    else:
        form = OrderForm()
    
    return render(request, 'delivery_app/card.html', {'form': form})


# Get products to show them 
@require_GET
def get_products(request):
    shop_id = request.GET.get('shop')
    products = Product.objects.filter(shop_id=shop_id)
    data = [{'name': product.name, 
             'description': product.description, 
             'price': product.price,
             'id': product.id,
             'shop_id': product.shop.id,
             'image': product.image,} 
            for product in products]
    
    return JsonResponse(data, safe=False)

