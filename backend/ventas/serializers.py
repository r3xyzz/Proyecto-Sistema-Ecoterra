
from rest_framework import serializers
from .models import OrdenCompra


class OrdenCompraSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(
        source="id_cliente.razon_social",
        read_only=True,
    )
    cotizacion_numero = serializers.CharField(
        source="id_cotizacion.numero_cotizacion",
        read_only=True,
        allow_null=True,
    )
    cotizacion_detalle = serializers.SerializerMethodField()

    class Meta:
        model = OrdenCompra
        fields = [
            "id_oc",
            "id_cliente",
            "cliente_nombre",
            "id_cotizacion",
            "cotizacion_numero",
            "cotizacion_detalle",
            "numero_oc",
            "fecha_oc",
            "ruta_documento_oc",
        ]

    def get_cotizacion_detalle(self, obj):
        cotizacion = obj.id_cotizacion

        if not cotizacion:
            return None

        return {
            "id_cotizacion": cotizacion.id_cotizacion,
            "numero_cotizacion": cotizacion.numero_cotizacion,
            "fecha_cotizacion": cotizacion.fecha_cotizacion,
            "vigencia_cotizacion": cotizacion.vigencia_cotizacion,
            "total_cotizacion": cotizacion.total_cotizacion,
            "estado_cotizacion": cotizacion.estado_cotizacion,
        }

    def validate_id_cotizacion(self, cotizacion):
        if cotizacion is None:
            return None

        cliente = self.initial_data.get("id_cliente")

        if cliente is None and self.instance:
            cliente = self.instance.id_cliente_id

        if cliente is None:
            raise serializers.ValidationError(
                "Debes indicar el cliente de la orden."
            )

        if str(cotizacion.id_cliente_id) != str(cliente):
            raise serializers.ValidationError(
                "La cotización pertenece a un cliente diferente."
            )

        if cotizacion.estado_cotizacion != "Vigente":
            raise serializers.ValidationError(
                "Solo se pueden asociar cotizaciones en estado Vigente."
            )

        ordenes_existentes = OrdenCompra.objects.filter(
            id_cotizacion=cotizacion
        )

        if self.instance:
            ordenes_existentes = ordenes_existentes.exclude(
                id_oc=self.instance.id_oc
            )

        if ordenes_existentes.exists():
            raise serializers.ValidationError(
                "Esta cotización ya está asociada a otra orden de compra."
            )

        return cotizacion


class OrdenCompraFacturacionSerializer(OrdenCompraSerializer):
    """Alias de campos para la ruta histórica /orden-compras/."""

    id = serializers.IntegerField(source="id_oc", read_only=True)
    fecha_orden = serializers.DateField(source="fecha_oc")

    class Meta(OrdenCompraSerializer.Meta):
        fields = [
            "id", "id_cliente", "cliente_nombre", "id_cotizacion",
            "cotizacion_numero", "cotizacion_detalle", "numero_oc",
            "fecha_orden", "ruta_documento_oc",
        ]
