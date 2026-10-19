# backend/facturacion/serializers.py
from rest_framework import serializers
from .models import Factura, DetalleFactura, OrdenCompra
from clientes.models import Cliente
from inventario.models import Producto


# ------------------- Cliente (nested) -------------------
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ["id", "razon_social", "rut", "email", "telefono"]


# ------------------- Producto (nested) -------------------
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["id", "codigo", "nombre", "unidad", "tipo"]


# ------------------- DetalleFactura (incluye producto) -------------------
class DetalleFacturaSerializer(serializers.ModelSerializer):
    id_producto = ProductoSerializer(read_only=True)
    nombre_producto = serializers.CharField(
        source="id_producto.nombre", read_only=True
    )

    class Meta:
        model = DetalleFactura
        fields = [
            "id",
            "id_factura",
            "id_producto",
            "nombre_producto",
            "cantidad",
            "precio_unitario",
            "descuento",
        ]


# ------------------- Factura (principal) -------------------
class FacturaSerializer(serializers.ModelSerializer):
    id_cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        write_only=True,
        source="id_cliente",
    )
    id_orden_compra = serializers.PrimaryKeyRelatedField(
        queryset=OrdenCompra.objects.all(),
        allow_null=True,
        required=False,
        source="id_orden_compra",
    )

    class Meta:
        model = Factura
        fields = [
            "id",
            "cliente_id",
            "id_orden_compra",
            "fecha_emision",
            "fecha_vencimiento",
            "subtotal",
            "descuento",
            "iva",
            "total",
            "estado",
            "numero_factura",
            "notas",
        ]
        read_only_fields = [
            "subtotal",
            "iva",
            "total",
            "fecha_emision",
            "estado",
        ]

    def create(self, validated_data):
        """Crea una factura; los detalles se gestionan por otro endpoint."""
        return Factura.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# ------------------- OrdenCompra (serializer) -------------------
class OrdenCompraSerializer(serializers.ModelSerializer):
    id_cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        write_only=True,
        source="id_cliente",
    )

    class Meta:
        model = OrdenCompra
        fields = ["id", "cliente_id", "fecha_orden", "estado"]
        read_only_fields = ["fecha_orden"]