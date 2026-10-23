from rest_framework import serializers

from .models import Cliente, Direccion


class DireccionSerializer(serializers.ModelSerializer):
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
