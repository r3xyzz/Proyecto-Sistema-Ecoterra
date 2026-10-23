from rest_framework import serializers

from .models import Proveedor


class ProveedorSerializer(serializers.ModelSerializer):
    estado = serializers.CharField(required=False, write_only=True, default="Activo")

    class Meta:
        model = Proveedor
        fields = [
            "id",
            "nombre_empresa",
            "pais",
            "contacto",
            "telefono",
            "email",
            "direccion",
            "estado",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["estado"] = "Activo"
        return data

    def validate_estado(self, value):
        if value not in ("Activo", "Inactivo"):
            raise serializers.ValidationError("Debe ser Activo o Inactivo.")
        return value

    def create(self, validated_data):
        validated_data.pop("estado", None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("estado", None)
        return super().update(instance, validated_data)