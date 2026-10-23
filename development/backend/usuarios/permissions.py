from django.db import connection

from rest_framework.permissions import BasePermission

from .models import Usuario


def tiene_permiso(usuario, modulo, nombre_permiso):
    """
    Comprueba el permiso usando el usuario autenticado
    y el rol registrado en la base de datos.
    """
    if not isinstance(usuario, Usuario) or not usuario.activo:
        return False

    # Mantiene la regla existente del proyecto:
    # el rol 1 es administrador.
    if usuario.id_rol == 1:
        return True

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT 1
            FROM rol_permiso rp
            INNER JOIN permiso p
                ON p.id_permiso = rp.id_permiso
            WHERE rp.id_rol = %s
              AND p.modulo_permiso = %s
              AND p.nombre_permiso = %s
              AND p.activo_permiso = TRUE
            LIMIT 1
            """,
            [usuario.id_rol, modulo, nombre_permiso],
        )
        return cursor.fetchone() is not None


class PermisoModulo(BasePermission):
    """
    Cada vista define los permisos requeridos por método HTTP.
    Los métodos sin regla explícita quedan denegados.
    """

    def has_permission(self, request, view):
        usuario = request.user

        if not isinstance(usuario, Usuario) or not usuario.activo:
            return False

        regla = getattr(view, "permisos_por_metodo", {}).get(
            request.method
        )

        if not regla:
            return False

        modulo, nombre_permiso = regla

        return tiene_permiso(
            usuario,
            modulo,
            nombre_permiso,
        )
