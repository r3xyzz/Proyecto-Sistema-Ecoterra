# backend/usuarios/views.py
from django.db import connection
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response

from .models import Usuario
from .serializers import UsuarioSerializer
from django.db import connection, transaction


# ---------- Helpers de permisos ----------
def _tiene_permiso(id_rol, modulo, accion):
    """Verifica si un rol tiene un permiso específico en la BD."""
    if not id_rol:
        return False
    if id_rol == 1:  # Administrador → todo permitido
        return True
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT 1
            FROM rol_permiso rp
            INNER JOIN permiso p ON p.id_permiso = rp.id_permiso
            WHERE rp.id_rol = %s
              AND p.modulo_permiso = %s
              AND p.nombre_permiso = %s
            LIMIT 1
            """,
            [id_rol, modulo, accion],
        )
        return cursor.fetchone() is not None


def _id_rol_from_request(request):
    """Lee el id_rol desde el header X-User-Role que envía el frontend."""
    try:
        return int(request.headers.get("X-User-Role", 0))
    except (TypeError, ValueError):
        return 0


# ---------- CRUD Usuarios con validación de permisos ----------
class UsuarioListView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def create(self, request, *args, **kwargs):
        id_rol = _id_rol_from_request(request)
        if not _tiene_permiso(id_rol, "usuarios_roles", "Crear usuarios"):
            return Response(
                {"detail": "No tienes permiso para crear usuarios."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)


class UsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def update(self, request, *args, **kwargs):
        id_rol = _id_rol_from_request(request)
        if not _tiene_permiso(id_rol, "usuarios_roles", "Editar usuarios"):
            return Response(
                {"detail": "No tienes permiso para editar usuarios."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        id_rol = _id_rol_from_request(request)
        if not _tiene_permiso(id_rol, "usuarios_roles", "Eliminar usuarios"):
            return Response(
                {"detail": "No tienes permiso para eliminar usuarios."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


# ---------- Permisos (endpoints existentes) ----------
@api_view(["GET"])
def permisos_list(request):
    """Devuelve el catálogo completo de permisos agrupados por módulo."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT id_permiso, nombre_permiso, modulo_permiso, descripcion_permiso
            FROM permiso
            WHERE activo_permiso = TRUE
            ORDER BY id_permiso
            """
        )
        rows = cursor.fetchall()

    return Response([
        {
            "id": r[0],
            "nombre": r[1],
            "modulo": r[2],
            "descripcion": r[3],
        }
        for r in rows
    ])


@api_view(["GET", "PUT"])
def rol_permisos(request, id_rol):
    """GET: permisos del rol. PUT: reemplazar la lista de permisos del rol."""
    if request.method == "GET":
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT p.id_permiso, p.nombre_permiso, p.modulo_permiso
                FROM rol_permiso rp
                INNER JOIN permiso p ON p.id_permiso = rp.id_permiso
                WHERE rp.id_rol = %s
                ORDER BY p.id_permiso
                """,
                [id_rol],
            )
            rows = cursor.fetchall()

        return Response({
            "id_rol": id_rol,
            "permisos": [
                {"id": r[0], "nombre": r[1], "modulo": r[2]} for r in rows
            ],
        })

    # ---------- PUT ----------
    id_rol_solicitante = _id_rol_from_request(request)
    if id_rol_solicitante != 1:
        return Response(
            {"detail": "Solo el administrador puede modificar permisos."},
            status=status.HTTP_403_FORBIDDEN,
        )

    ids_permisos = request.data.get("permisos", [])

    # Normalizar: enteros, sin duplicados, sin ceros/nulos
    try:
        ids_clean = sorted({int(i) for i in ids_permisos if i})
    except (TypeError, ValueError):
        return Response(
            {"detail": "Todos los permisos deben ser IDs numéricos."},
            status=400,
        )

    with transaction.atomic():
        with connection.cursor() as cursor:
            # 1. Borrar los actuales
            cursor.execute("DELETE FROM rol_permiso WHERE id_rol = %s", [id_rol])

            # 2. Reinsertar uno por uno (con ON CONFLICT por seguridad)
            for id_permiso in ids_clean:
                cursor.execute(
                    """
                    INSERT INTO rol_permiso (id_rol, id_permiso)
                    VALUES (%s, %s)
                    ON CONFLICT (id_rol, id_permiso) DO NOTHING
                    """,
                    [id_rol, id_permiso],
                )

    return Response({
        "detail": "Permisos actualizados.",
        "total": len(ids_clean),
    })