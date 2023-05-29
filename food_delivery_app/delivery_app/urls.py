from django.urls import path
from delivery_app import views


app_name = 'delivery_app'

urlpatterns = [
    path('', views.ShopsView.as_view(), name='index'),
    path('card/', views.card, name='card'),   
    path('api/products/', views.get_products, name='get_products'),
]
