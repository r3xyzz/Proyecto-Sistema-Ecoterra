from django.urls import path

from .auth_views import login_view
from .views import (
    UsuarioDetailView,
    UsuarioListView,
    permisos_list,
    rol_permisos,
)


urlpatterns = [
    path("usuarios/", UsuarioListView.as_view(), name="usuarios-list"),
    path("usuarios/<int:pk>/", UsuarioDetailView.as_view(), name="usuarios-detail"),
    path("auth/login/", login_view, name="auth-login"),
    path("permisos/", permisos_list, name="permisos-list"),
    path("roles/<int:id_rol>/permisos/", rol_permisos, name="rol-permisos"),
]