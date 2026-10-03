from django.urls import path

from .auth_views import login_view
from .views import UsuarioDetailView, UsuarioListView


urlpatterns = [
    path("usuarios/", UsuarioListView.as_view(), name="usuarios-list"),
    path("usuarios/<int:pk>/", UsuarioDetailView.as_view(), name="usuarios-detail"),
    path("auth/login/", login_view, name="auth-login"),
]