from rest_framework import viewsets
from .models import OrdenCompra, Factura
from .serializers import OrdenCompraSerializer, FacturaSerializer


class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenCompra.objects.all().order_by("-id_oc")
    serializer_class = OrdenCompraSerializer


class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all().order_by("-id_factura")
    serializer_class = FacturaSerializer