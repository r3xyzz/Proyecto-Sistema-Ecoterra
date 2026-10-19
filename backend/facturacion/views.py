# backend/facturacion/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from django.db.models import Sum, Value
from django.db.models.functions import Coalesce

from .models import Factura, DetalleFactura, OrdenCompra
from .serializers import (
    FacturaSerializer,
    DetalleFacturaSerializer,
    OrdenCompraSerializer,
    ClienteSerializer,
)

from clientes.models import Cliente


# ----------------------------------------------------------------------
#  ClienteViewSet – solo lectura (listado de clientes)
# ----------------------------------------------------------------------
class ClienteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Simple viewset que lista todos los clientes.
    """
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ----------------------------------------------------------------------
#  OrdenCompraViewSet – CRUD completo
# ----------------------------------------------------------------------
class OrdenCompraViewSet(viewsets.ModelViewSet):
    """
    CRUD de órdenes de compra.
    """
    queryset = OrdenCompra.objects.select_related("id_cliente").all()
    serializer_class = OrdenCompraSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


# ----------------------------------------------------------------------
#  FacturaViewSet – listado, filtro por cliente y cambio de estado
# ----------------------------------------------------------------------
class FacturaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    - Listado paginado de facturas.
    - Filtrado por cliente: /api/facturas/cliente/<cliente_id>/
    - Acción estado para cambiar el estado de una factura.
    """
    queryset = Factura.objects.select_related(
        "id_cliente", "id_orden_compra"
    ).all()

    serializer_class = FacturaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(
        detail=True,
        methods=["patch"],
        url_path="acciones",
    )
    def estado(self, request, pk=None):
        """
        PATCH /api/facturas/<pk>/acciones/
        Body esperado: {"estado": "EMITIDA"}
        """
        factura = self.get_object()
        nuevo_estado = request.data.get("estado")

        if not nuevo_estado:
            return Response(
                {"error": "Debe enviar 'estado' en el body."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        estados_validos = {
            valor for valor, etiqueta in Factura.ESTADO_CHOICES
        }

        if nuevo_estado not in estados_validos:
            return Response(
                {"error": "Estado no permitido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        factura.estado = nuevo_estado
        factura.save(update_fields=["estado"])

        return Response(
            {
                "detalle": (
                    f"Factura {factura.id} cambió a {nuevo_estado}"
                )
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path=r"cliente/(?P<cliente_id>\d+)",
    )
    def por_cliente(self, request, cliente_id=None):
        """
        GET /api/facturas/cliente/<cliente_id>/
        Lista paginada de facturas del cliente solicitado.
        """
        facturas = self.get_queryset().filter(
            id_cliente=cliente_id
        )

        page = self.paginate_queryset(facturas)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(facturas, many=True)
        return Response(serializer.data)