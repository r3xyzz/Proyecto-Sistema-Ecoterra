from rest_framework import viewsets
from usuarios.permissions import PermisoModulo
from .models import OrdenCompra, Factura
from .serializers import OrdenCompraSerializer, FacturaSerializer


class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenCompra.objects.all().order_by("-id_oc")
    serializer_class = OrdenCompraSerializer
    permission_classes = [PermisoModulo]

    permisos_por_metodo = {
        "GET": ("ordenes_compra", "Consultar"),
        "POST": ("ordenes_compra", "Crear"),
        "PUT": ("ordenes_compra", "Editar"),
        "PATCH": ("ordenes_compra", "Editar"),
        "DELETE": ("ordenes_compra", "Eliminar"),
    }


class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all().order_by("-id_factura")
    serializer_class = FacturaSerializer
    permission_classes = [PermisoModulo]

    permisos_por_metodo = {
        "GET": ("facturacion", "Consultar"),
        "POST": ("facturacion", "Crear"),
        "PUT": ("facturacion", "Editar"),
        "PATCH": ("facturacion", "Editar"),
        "DELETE": ("facturacion", "Eliminar"),
    }