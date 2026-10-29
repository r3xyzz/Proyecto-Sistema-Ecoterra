# backend/usuarios/views.py
from django.db import connection
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Usuario
from .serializers import UsuarioSerializer
from .permissions import PermisoModulo, tiene_permiso
from django.db import connection, transaction

# ---------- CRUD Usuarios con validación de permisos ----------
class UsuarioListView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [PermisoModulo]

    permisos_por_metodo = {
        "GET": ("usuarios_roles", "Consultar usuarios"),
        "POST": ("usuarios_roles", "Crear usuarios"),
    }

class UsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [PermisoModulo]

    permisos_por_metodo = {
        "GET": ("usuarios_roles", "Consultar usuarios"),
        "PUT": ("usuarios_roles", "Editar usuarios"),
        "PATCH": ("usuarios_roles", "Editar usuarios"),
        "DELETE": ("usuarios_roles", "Eliminar usuarios"),
    }
    
    def update(self, request, *args, **kwargs):
        # Imprimimos para depurar qué llega desde el frontend
        print("Datos recibidos para actualizar:", request.data)
        
        # Si viene la contraseña, nos aseguramos de que el serializer la procese
        if "contrasena" in request.data:
            print("Contraseña recibida:", request.data["contrasena"])
        
        return super().update(request, *args, **kwargs) 

# ---------- Permisos (endpoints existentes) ----------
# Comprueba el permiso administrativo y devuelve el catálogo de permisos activos ordenado por identificador.
@api_view(["GET"])
def permisos_list(request):
    """Devuelve el catálogo completo de permisos agrupados por módulo."""
    if not tiene_permiso(
    request.user,
    "usuarios_roles",
    "Administrar roles y permisos",
    ):
        return Response(
        {"detail": "No tienes permiso para consultar los permisos."},
        status=status.HTTP_403_FORBIDDEN,
        )
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


# Consulta los permisos del rol con GET o intenta reemplazarlos atómicamente con PUT tras comprobar autorización.
@api_view(["GET", "PUT"])
def rol_permisos(request, id_rol):
    """GET: permisos del rol. PUT: reemplazar la lista de permisos del rol."""
    if not tiene_permiso(
    request.user,
    "usuarios_roles",
    "Administrar roles y permisos",
    ):
        return Response(
        {"detail": "No tienes permiso para gestionar los permisos."},
        status=status.HTTP_403_FORBIDDEN,
        )
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