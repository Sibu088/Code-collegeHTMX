from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user/<int:id>/edit/', views.edit_profile, name='edit_profile'),
    path('user/<int:id>', views.update_profile, name='update_profile'),  # Remove trailing slash
]