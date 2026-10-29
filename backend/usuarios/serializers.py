# backend/usuarios/serializers.py
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Usuario
from .permissions import tiene_permiso


ROLE_LABEL_TO_ID = {
    "Superusuario / Admin": 1,
    "Usuario con privilegios": 2,
    "Usuario base": 3,
}
ROLE_ID_TO_LABEL = {value: key for key, value in ROLE_LABEL_TO_ID.items()}


class RolUsuarioField(serializers.Field):
    # Convierte el identificador del rol en su etiqueta o utiliza Usuario base como alternativa.
    def to_representation(self, value):
        return ROLE_ID_TO_LABEL.get(int(value), "Usuario base")

    # Valida un identificador o etiqueta de rol y lo convierte en el identificador correspondiente.
    def to_internal_value(self, value):
        if isinstance(value, int) and not isinstance(value, bool):
            if value in ROLE_ID_TO_LABEL:
                return value
            raise serializers.ValidationError("Rol inválido.")
        if not isinstance(value, str):
            raise serializers.ValidationError("El rol debe ser texto.")
        role_id = ROLE_LABEL_TO_ID.get(value.strip())
        if role_id is None:
            raise serializers.ValidationError("Rol inválido.")
        return role_id


class EstadoUsuarioField(serializers.Field):
    # Convierte el estado booleano del usuario en Activo o Inactivo.
    def to_representation(self, value):
        return "Activo" if value else "Inactivo"

    # Convierte un booleano o el texto Activo/Inactivo en el estado booleano del usuario.
    def to_internal_value(self, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str) and value.lower() in {"activo", "inactivo"}:
            return value.lower() == "activo"
        raise serializers.ValidationError("El estado debe ser Activo o Inactivo.")

class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolUsuarioField(source="id_rol")
    estado = EstadoUsuarioField(source="activo")
    contrasena = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )
    permisos = serializers.JSONField(required=False, write_only=True)

    
    # Exige permiso administrativo cuando los datos enviados modifican el rol o el estado del usuario.
    def validate(self, attrs):
        request = self.context.get("request")
        usuario_solicitante = getattr(request, "user", None)

        # Cambiar el rol o activar/desactivar cuentas es
        # una operación administrativa independiente.
        modifica_rol = "id_rol" in attrs
        modifica_estado = "activo" in attrs

        if modifica_rol or modifica_estado:
            if not tiene_permiso(
                usuario_solicitante,
                "usuarios_roles",
                "Administrar roles y permisos",
            ):
                raise serializers.ValidationError({
                    "detail": (
                        "No tienes permiso para cambiar roles "
                        "o el estado de los usuarios."
                    )
                })
        return attrs


    # Acepta un objeto JSON de permisos y convierte los valores vacíos en un objeto vacío.
    def validate_permisos(self, value):
        if value in (None, ""):
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("Los permisos deben ser un objeto JSON.")
        return value

    # Descarta los permisos enviados y crea el usuario con la contraseña hasheada o temporal por defecto.
    def create(self, validated_data):
        validated_data.pop("permisos", None)
        # 👇 Hashear la contraseña o usar "temporal" por defecto
        raw_password = validated_data.pop("contrasena", "") or "temporal"
        validated_data["contrasena"] = make_password(raw_password)
        return super().create(validated_data)

    # Descarta los permisos enviados y actualiza el usuario hasheando la contraseña solo si se proporciona.
    def update(self, instance, validated_data):
        validated_data.pop("permisos", None)
        # 👇 Si envían contraseña, hashearla; si no, no la tocan
        raw_password = validated_data.pop("contrasena", None)
        if raw_password:
            validated_data["contrasena"] = make_password(raw_password)
        return super().update(instance, validated_data)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "nombre",
            "email",
            "rol",
            "estado",
            "contrasena",
            "permisos",
        ]