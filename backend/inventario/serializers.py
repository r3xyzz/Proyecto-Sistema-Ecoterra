import random
import string

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
        ]


# 👇 NUEVO: ProductoSerializer
class ProductoSerializer(serializers.ModelSerializer):
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
            "estado",
        ]