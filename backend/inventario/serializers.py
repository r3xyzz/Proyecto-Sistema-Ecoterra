from django.db.models import Sum
from rest_framework import serializers

from .models import Inventario, Producto


class ProductoSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    estado = serializers.SerializerMethodField()

    def get_stock(self, producto):
        return producto.existencias.aggregate(total=Sum("cantidad"))["total"] or 0

    def get_estado(self, producto):
        return "Activo"

    class Meta:
        model = Producto
        fields = ["id", "codigo", "nombre", "descripcion", "tipo", "unidad", "stock_minimo", "stock", "estado"]


class InventarioSerializer(serializers.ModelSerializer):
    producto_codigo = serializers.CharField(source="producto.codigo", read_only=True)

    class Meta:
        model = Inventario
        fields = ["id", "lote", "producto", "producto_codigo", "cantidad", "envase", "fecha_fabricacion", "fecha_vencimiento", "ubicacion", "estado"]
