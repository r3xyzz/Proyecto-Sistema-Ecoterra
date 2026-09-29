from rest_framework import serializers

from .models import Cliente, Direccion


class DireccionSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        cliente = self.instance.cliente if self.instance else self.context.get("cliente")
        principal = attrs.get("principal", self.instance.principal if self.instance else False)

        if cliente and principal:
            existing = Direccion.objects.filter(cliente=cliente, principal=True)
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            if existing.exists():
                raise serializers.ValidationError(
                    {"principal": "Este cliente ya tiene una dirección principal."}
                )

        return attrs

    class Meta:
        model = Direccion
        fields = ["id", "nombre", "ciudad", "tipo", "principal"]


class ClienteSerializer(serializers.ModelSerializer):
    direcciones = DireccionSerializer(many=True, read_only=True)

    class Meta:
        model = Cliente
        fields = [
            "id",
            "rut",
            "razon_social",
            "nombre_fantasia",
            "ciudad",
            "telefono",
            "email",
            "representante",
            "estado",
            "direcciones",
        ]
