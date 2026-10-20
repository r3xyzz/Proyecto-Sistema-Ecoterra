
# backend/facturacion/views.py

from django.db.models import Sum, Value
from django.db.models.functions import Coalesce

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from usuarios.permissions import PermisoModulo

from .models import Factura, DetalleFactura, OrdenCompra
from .serializers import (
    FacturaSerializer,
    DetalleFacturaSerializer,
    OrdenCompraSerializer,
)

from clientes.models import Cliente


# ============================================================
# ÓRDENES DE COMPRA
# ============================================================

class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenCompra.objects.select_related(
        "id_cliente",
    ).all()

    serializer_class = OrdenCompraSerializer


# ============================================================
# FACTURAS
# ============================================================

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.select_related(
        "id_cliente",
        "id_orden_compra",
    ).all()

    serializer_class = FacturaSerializer
    permission_classes = [PermisoModulo]

    permisos_por_metodo = {
        "GET": ("facturacion", "Consultar"),
        "HEAD": ("facturacion", "Consultar"),
        "OPTIONS": ("facturacion", "Consultar"),
        "POST": ("facturacion", "Crear"),
        "PUT": ("facturacion", "Editar"),
        "PATCH": ("facturacion", "Editar"),
        "DELETE": ("facturacion", "Eliminar"),
    }

    def create(self, request, *args, **kwargs):
        print("\n" + "=" * 60)
        print("FACTURAS POST: FacturaViewSet correcto")
        print("VISTA:", self.__class__.__module__)
        print("BODY RECIBIDO:", request.data)

        serializer_class = self.get_serializer_class()

        print(
            "SERIALIZER:",
            serializer_class.__module__,
            serializer_class.__name__,
        )

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("ERRORES DEL SERIALIZER:", serializer.errors)
            print("=" * 60 + "\n")

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)

        print("FACTURA CREADA:", serializer.data)
        print("=" * 60 + "\n")

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    @action(detail=True, methods=["patch"], url_path="acciones")
    def estado(self, request, pk=None):
        factura = self.get_object()
        nuevo_estado = request.data.get("estado")

        estados_validos = [
            opcion[0]
            for opcion in Factura.ESTADO_CHOICES
        ]

        if nuevo_estado not in estados_validos:
            return Response(
                {
                    "error": "Estado no válido.",
                    "estados_permitidos": estados_validos,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        factura.estado = nuevo_estado
        factura.save(update_fields=["estado"])

        return Response(
            FacturaSerializer(factura).data,
            status=status.HTTP_200_OK,
        )
