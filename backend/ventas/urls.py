from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdenCompraViewSet, FacturaViewSet

router = DefaultRouter()
router.register(r"ordenes-compra", OrdenCompraViewSet, basename="orden-compra")
router.register(r"facturas", FacturaViewSet, basename="factura")

urlpatterns = [
    path("", include(router.urls)),
]