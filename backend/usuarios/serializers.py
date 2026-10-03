from rest_framework import serializers

from .models import Usuario


ROLE_LABEL_TO_ID = {
    "Superusuario / Admin": 1,
    "Usuario con privilegios": 2,
    "Usuario base": 3,
}
ROLE_ID_TO_LABEL = {value: key for key, value in ROLE_LABEL_TO_ID.items()}


class RolUsuarioField(serializers.Field):
    def to_representation(self, value):
        return ROLE_ID_TO_LABEL.get(int(value), "Usuario base")

    def to_internal_value(self, value):
        if isinstance(value, int):
            return value
        if not isinstance(value, str):
            raise serializers.ValidationError("El rol debe ser texto.")

        role_id = ROLE_LABEL_TO_ID.get(value.strip())
        if role_id is None:
            raise serializers.ValidationError("Rol inválido.")
        return role_id


class EstadoUsuarioField(serializers.Field):
    def to_representation(self, value):
        return "Activo" if value else "Inactivo"

    def to_internal_value(self, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str) and value.lower() in {"activo", "inactivo"}:
            return value.lower() == "activo"
        raise serializers.ValidationError("El estado debe ser Activo o Inactivo.")


class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolUsuarioField(source="id_rol")
    estado = EstadoUsuarioField(source="activo")
    permisos = serializers.JSONField(required=False, write_only=True)

    def validate_permisos(self, value):
        if value in (None, ""):
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("Los permisos deben ser un objeto JSON.")
        return value

    def create(self, validated_data):
        validated_data.pop("permisos", None)
        validated_data.setdefault("contrasena", "temporal")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("permisos", None)
        return super().update(instance, validated_data)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "nombre",
            "email",
            "rol",
            "estado",
            "permisos",
        ]