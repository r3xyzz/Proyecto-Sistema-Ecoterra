# inventario/serializers.py
import random
import string

from django.db.models import Sum  
from rest_framework import serializers

from .models import Inventario, Movimiento, Producto


class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = [
            "id",
            "id_producto",
            "codigo_lote",
            "cantidad",
            "tipo_envase",
            "fecha_fabricacion",
            "fecha_vencimiento",
            "ubicacion",
            "estado",
            "stock_disponible",
            "stock_total",
        ]

    def create(self, validated_data):
        if not validated_data.get("codigo_lote"):
            suffix = "".join(random.choices(string.digits, k=4))
            validated_data["codigo_lote"] = f"LOTE-{suffix}"
        return super().create(validated_data)


class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = [
            "id",
            "id_inventario",
            "id_usuario",
            "tipo_movimiento",
            "cantidad_movimiento",
            "fecha_movimiento",
            "referencia",
            "observacion",
            "stock_anterior",
            "stock_posterior",
        ]


# ProductoSerializer
class ProductoSerializer(serializers.ModelSerializer):
    stock_disponible = serializers.SerializerMethodField()
    stock_total = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            "id",
            "codigo",
            "nombre",
            "descripcion",
            "tipo",
            "unidad",
            "stock_minimo",
            "stock_disponible",
            "stock_total",
            "estado",
        ]

    def get_stock_disponible(self, obj):
        """Suma solo los lotes con estado 'Disponible' (RF-04)."""
        total = (
            Inventario.objects.filter(
                id_producto=obj.id,
                estado="Disponible",
            ).aggregate(total=Sum("cantidad"))["total"]
        )
        return float(total or 0)

    def get_stock_total(self, obj):
        """Suma TODOS los lotes, sin importar su estado."""
        total = (
            Inventario.objects.filter(id_producto=obj.id).aggregate(
                total=Sum("cantidad")
            )["total"]
        )
        return float(total or 0)