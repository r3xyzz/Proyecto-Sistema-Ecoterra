from rest_framework import viewsets
from usuarios.permissions import PermisoModulo
from .models import Cotizacion, DetalleCotizacion
from .serializers import CotizacionSerializer, DetalleCotizacionSerializer


class CotizacionViewSet(viewsets.ModelViewSet):
    queryset = Cotizacion.objects.all().order_by("-id_cotizacion")
    serializer_class = CotizacionSerializer
    permission_classes = [PermisoModulo]

    # Ajusta las acciones según los permisos que tengas en tu base de datos
    # Si en tu BD el módulo se llama "cotizaciones" y las acciones son "Consultar", "Crear", etc.
    permisos_por_metodo = {
        "GET": ("cotizaciones", "Consultar"),
        "POST": ("cotizaciones", "Crear"),
        "PUT": ("cotizaciones", "Editar"),
        "PATCH": ("cotizaciones", "Editar"),
        "DELETE": ("cotizaciones", "Eliminar"),
    }


class DetalleCotizacionViewSet(viewsets.ModelViewSet):
    queryset = DetalleCotizacion.objects.all()
    serializer_class = DetalleCotizacionSerializer
    permission_classes = [PermisoModulo]

    permisos_por_metodo = {
        "GET": ("cotizaciones", "Consultar"),
        "POST": ("cotizaciones", "Crear"),
        "PUT": ("cotizaciones", "Editar"),
        "PATCH": ("cotizaciones", "Editar"),
        "DELETE": ("cotizaciones", "Eliminar"),
    }