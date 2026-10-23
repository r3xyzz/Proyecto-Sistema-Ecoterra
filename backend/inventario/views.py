from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import Inventario, Producto
from .serializers import InventarioSerializer, ProductoSerializer


class ProductoListView(ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class ProductoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class InventarioListView(ListCreateAPIView):
    queryset = Inventario.objects.select_related("producto")
    serializer_class = InventarioSerializer


class InventarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Inventario.objects.select_related("producto")
    serializer_class = InventarioSerializer
