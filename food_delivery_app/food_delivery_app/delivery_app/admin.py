from django.contrib import admin
from .models import Shop, Product, OrderItem, Order


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    
    
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'email', 'phone', 'address', 'total_price', 'created_at')
    inlines = [OrderItemInline]


admin.site.register(Order, OrderAdmin)
admin.site.register(Shop)
admin.site.register(Product)
admin.site.register(OrderItem)