from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Usuario
from .serializers import ROLE_ID_TO_LABEL


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password") or ""

    if not email or not password:
        return Response(
            {"detail": "Correo y contraseña son obligatorios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        usuario = Usuario.objects.get(email__iexact=email)
    except Usuario.DoesNotExist:
        return Response(
            {"detail": "Credenciales inválidas."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if usuario.contrasena != password:
        return Response(
            {"detail": "Credenciales inválidas."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not usuario.activo:
        return Response(
            {"detail": "Usuario inactivo. Contacta al administrador."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return Response(
        {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": ROLE_ID_TO_LABEL.get(usuario.id_rol, "Usuario base"),
            "estado": "Activo" if usuario.activo else "Inactivo",
        },
        status=status.HTTP_200_OK,
    )