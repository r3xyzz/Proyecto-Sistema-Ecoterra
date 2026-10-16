from rest_framework import serializers
from .models import Cotizacion, DetalleCotizacion


class DetalleCotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCotizacion
        fields = ["id_producto", "descripcion_dc", "cantidad_dc", "precio_unitario_dc", "subtotal_dc"]


class CotizacionSerializer(serializers.ModelSerializer):
    detalles = DetalleCotizacionSerializer(many=True, write_only=True)
    cliente_nombre = serializers.CharField(source="id_cliente.razon_social", read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            "id_cotizacion",
            "id_cliente",
            "cliente_nombre",
            "numero_cotizacion",
            "fecha_cotizacion",
            "dias_vigencia_cotizacion",
            "vigencia_cotizacion",
            "condicion_pago_cotizacion",
            "subtotal_cotizacion",
            "iva_cotizacion",
            "total_cotizacion",
            "observacion_cotizacion",
            "estado_cotizacion",
            "ruta_pdf_cotizacion",
            "detalles",
        ]
        # 👇 CLAVE: el backend genera estos campos
        read_only_fields = ["id_cotizacion", "numero_cotizacion", "ruta_pdf_cotizacion"]

    def create(self, validated_data):
        detalles_data = validated_data.pop("detalles", [])

        # Generar número de cotización automáticamente
        ultimo = Cotizacion.objects.order_by("-id_cotizacion").first()
        siguiente_numero = (ultimo.id_cotizacion + 1) if ultimo else 1
        validated_data["numero_cotizacion"] = f"COT-{siguiente_numero:04d}"

        # ruta_pdf_cotizacion no puede ser NULL, se asigna vacío
        validated_data.setdefault("ruta_pdf_cotizacion", "")

        cotizacion = Cotizacion.objects.create(**validated_data)

        for detalle_data in detalles_data:
            DetalleCotizacion.objects.create(id_cotizacion=cotizacion, **detalle_data)

        return cotizacion

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["detalles"] = DetalleCotizacionSerializer(
            instance.detallecotizacion_set.all(), many=True
        ).data
        return data