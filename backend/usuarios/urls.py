from django.urls import path

from .views import UsuarioDetailView, UsuarioListView


urlpatterns = [
    path("usuarios/", UsuarioListView.as_view(), name="usuarios-list"),
    path("usuarios/<int:pk>/", UsuarioDetailView.as_view(), name="usuarios-detail"),
]