from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("clientes.urls")),
    path("api/", include("inventario.urls")),
    path("api/", include("proveedores.urls")),
    path("api/", include("usuarios.urls")),
]
