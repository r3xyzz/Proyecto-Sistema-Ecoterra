from decimal import Decimal

from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response

from .models import Inventario, Movimiento, Producto
from .serializers import (
    InventarioSerializer,
    MovimientoSerializer,
    ProductoSerializer,
)


# ---------- Productos ----------
class ProductoListView(ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class ProductoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


# ---------- Inventario (Lotes) ----------
class InventarioListView(ListCreateAPIView):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer


class InventarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer


# ---------- Movimientos ----------
class MovimientoListView(ListCreateAPIView):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer

    def create(self, request, *args, **kwargs):
        tipo = request.data.get("tipo_movimiento")
        cantidad_raw = request.data.get("cantidad_movimiento")
        id_inventario = request.data.get("id_inventario")
        id_usuario = request.data.get("id_usuario")

        # --- Validaciones básicas ---
        if tipo not in ("Entrada", "Salida", "Ajuste"):
            return Response(
                {"detail": "Tipo de movimiento inválido."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not cantidad_raw:
            return Response(
                {"detail": "La cantidad es obligatoria."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            cantidad = Decimal(str(cantidad_raw))
        except Exception:
            return Response(
                {"detail": "Cantidad inválida."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cantidad <= 0:
            return Response(
                {"detail": "La cantidad debe ser mayor a 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            lote = Inventario.objects.get(pk=id_inventario)
        except Inventario.DoesNotExist:
            return Response(
                {"detail": "Lote no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # --- Validar stock suficiente en Salida ---
        if tipo == "Salida" and lote.cantidad < cantidad:
            return Response(
                {
                    "detail": f"Stock insuficiente. Disponible: {lote.cantidad} L."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # --- Crear movimiento (SIEMPRE cantidad positiva) ---
        movimiento = Movimiento.objects.create(
            id_inventario=lote.id,
            id_usuario=id_usuario,
            tipo_movimiento=tipo,
            cantidad_movimiento=cantidad,  # ✅ positivo (la BD lo exige)
            fecha_movimiento=timezone.now(),
            referencia=request.data.get("referencia") or None,
            observacion=request.data.get("observacion") or None,
        )

        # --- Actualizar lote según tipo ---
        if tipo == "Entrada":
            lote.cantidad = lote.cantidad + cantidad
        elif tipo == "Salida":
            lote.cantidad = lote.cantidad - cantidad
        else:  # Ajuste
            lote.cantidad = lote.cantidad + cantidad

        if lote.cantidad < 0:
            lote.cantidad = Decimal("0")
        lote.save(update_fields=["cantidad"])

        serializer = self.get_serializer(movimiento)
        return Response(serializer.data, status=status.HTTP_201_CREATED)