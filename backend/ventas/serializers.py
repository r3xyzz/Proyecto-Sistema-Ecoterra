from rest_framework import serializers
from .models import OrdenCompra, Factura


class OrdenCompraSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source="id_cliente.razon_social", read_only=True)
    cotizacion_numero = serializers.CharField(
        source="id_cotizacion.numero_cotizacion", read_only=True, allow_null=True
    )

    class Meta:
        model = OrdenCompra
        fields = [
            "id_oc",
            "id_cliente",
            "cliente_nombre",
            "id_cotizacion",
            "cotizacion_numero",
            "numero_oc",
            "fecha_oc",
            "ruta_documento_oc",
        ]


class FacturaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source="id_cliente.razon_social", read_only=True)
    oc_numero = serializers.CharField(source="id_oc.numero_oc", read_only=True)

    class Meta:
        model = Factura
        fields = [
            "id_factura",
            "id_oc",
            "oc_numero",
            "id_cliente",
            "cliente_nombre",
            "numero_factura",
            "fecha_factura",
            "subtotal_factura",
            "iva_factura",
            "total_factura",
            "estado_factura",
            "ruta_pdf_factura",
        ]