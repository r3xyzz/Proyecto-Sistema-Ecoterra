# backend/facturacion/models.py
from django.db import models
from django.db.models import (
    F,
    Sum,
)
from django.db.models.functions import Coalesce
from django.core.validators import MinValueValidator
from clientes.models import Cliente   # modelo existente en la app "clientes"
from inventario.models import Producto   # modelo existente en la app "inventario"


# ----------------------------------------------------------------------
#  OrdenCompra – modelo de órdenes de compra
# ----------------------------------------------------------------------
class OrdenCompra(models.Model):
    """
    Representa una orden de compra vinculada a un cliente y con estado
    (PENDIENTE, APROBADA, ANULADA).
    """
    id = models.AutoField(
        primary_key=True,
        db_column="id_orden_compra",
    )
    id_cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column="id_cliente",
    )
    fecha_orden = models.DateField(
        auto_now_add=True,
        db_column="fecha_orden",
    )
    estado = models.CharField(
        max_length=20,
        choices=[
            ("PENDIENTE", "Pendiente"),
            ("APROBADA", "Aprobada"),
            ("ANULADA", "Anulada"),
        ],
        default="PENDIENTE",
        db_column="estado_orden",
    )

    class Meta:
        db_table = "orden_compra"
        ordering = ["-fecha_orden"]
        verbose_name = "orden de compra"
        verbose_name_plural = "ordenes de compra"

    def __str__(self):
        return f"OC {self.id} - {self.id_cliente}"


# ----------------------------------------------------------------------
#  Factura – tabla principal de facturación
# ----------------------------------------------------------------------
class Factura(models.Model):
    ESTADO_CHOICES = [
        ("PENDIENTE", "Pendiente"),
        ("EMITIDA", "Emitida"),
        ("ANULADA", "Anulada"),
        ("PAGADA", "Pagada"),
    ]

    id = models.AutoField(
        primary_key=True,
        db_column="id_factura",
    )
    id_cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column="id_cliente",
    )
    id_orden_compra = models.ForeignKey(
        OrdenCompra,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="id_orden_compra",
    )
    fecha_emision = models.DateField(
        auto_now_add=True,
        db_column="fecha_emision",
    )
    fecha_vencimiento = models.DateField(
        db_column="fecha_vencimiento",
    )
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        db_column="subtotal",
    )
    descuento = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        db_column="descuento",
    )
    iva = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        db_column="iva",
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        db_column="total_factura",
    )
    estado = models.CharField(
        max_length=10,
        choices=ESTADO_CHOICES,
        default="PENDIENTE",
        db_column="estado_factura",
    )
    numero_factura = models.CharField(
        max_length=50,
        unique=True,
        db_column="numero_factura",
    )
    notas = models.TextField(
        blank=True,
        null=True,
        db_column="notas_factura",
    )

    class Meta:
        db_table = "factura"
        ordering = ["-fecha_emision"]
        indexes = [
            models.Index(fields=["id_cliente"]),
            models.Index(fields=["numero_factura"]),
        ]

    def __str__(self):
        return f"Factura {self.numero_factura} - {self.id_cliente}"

    def save(self, *args, **kwargs):
        """
        Se recalculan automáticamente los campos monetarios:
            subtotal = Σ(cantidad × precio_unitario)
            iva      = subtotal × 0.19 (19 % de IVA)
            total    = subtotal + iva − descuento
        """
        subtotal = (
            self.detallefactura_set
            .aggregate(
                total=Coalesce(
                    Sum(F("cantidad") * F("precio_unitario")),
                    0,
                )
            )["total"]
            or 0
        )
        self.subtotal = subtotal
        self.iva = subtotal * 0.19
        self.total = subtotal + self.iva - self.descuento
        super().save(*args, **kwargs)


# ----------------------------------------------------------------------
#  DetalleFactura – línea de producto dentro de una factura
# ----------------------------------------------------------------------
class DetalleFactura(models.Model):
    """
    Cada línea de una factura (producto + cantidad + precio + descuento).
    """
    id = models.AutoField(
        primary_key=True,
        db_column="id_detalle_factura",
    )
    id_factura = models.ForeignKey(
        Factura,
        on_delete=models.CASCADE,
        db_column="id_factura",
    )
    id_producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        db_column="id_producto",
    )
    cantidad = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        db_column="cantidad_detalle",
    )
    precio_unitario = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        db_column="precio_unitario_detalle",
    )
    descuento = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        db_column="descuento_detalle",
    )

    class Meta:
        db_table = "detalle_factura"
        unique_together = ("id_factura", "id_producto")

    def __str__(self):
        return f"Detalle {self.id} – {self.id_producto} x {self.cantidad}"