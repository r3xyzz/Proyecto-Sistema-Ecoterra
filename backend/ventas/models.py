from django.db import models
from decimal import Decimal


class OrdenCompra(models.Model):
    id_oc = models.AutoField(primary_key=True, db_column="id_oc")
    id_cliente = models.ForeignKey(
        "clientes.Cliente",
        on_delete=models.DO_NOTHING,
        db_column="id_cliente",
        to_field="id",
        related_name="ordenes_compra",
    )
    id_cotizacion = models.ForeignKey(
        "cotizaciones.Cotizacion",
        on_delete=models.DO_NOTHING,
        db_column="id_cotizacion",
        to_field="id_cotizacion",
        null=True,
        blank=True,
        related_name="ordenes_compra",
    )
    numero_oc = models.CharField(max_length=50, unique=True, db_column="numero_oc")
    fecha_oc = models.DateField(db_column="fecha_oc")
    ruta_documento_oc = models.CharField(max_length=255, db_column="ruta_documento_oc")

    class Meta:
        db_table = "orden_compra"
        managed = False

    def __str__(self):
        return self.numero_oc


class Factura(models.Model):
    id_factura = models.AutoField(primary_key=True, db_column="id_factura")
    id_oc = models.OneToOneField(
        OrdenCompra,
        on_delete=models.DO_NOTHING,
        db_column="id_oc",
        to_field="id_oc",
        related_name="factura",
    )
    id_cliente = models.ForeignKey(
        "clientes.Cliente",
        on_delete=models.DO_NOTHING,
        db_column="id_cliente",
        to_field="id",
        related_name="facturas",
    )
    numero_factura = models.CharField(max_length=50, unique=True, db_column="numero_factura")
    fecha_factura = models.DateField(db_column="fecha_factura")
    subtotal_factura = models.DecimalField(max_digits=12, decimal_places=2, db_column="subtotal_factura")
    iva_factura = models.DecimalField(max_digits=12, decimal_places=2, db_column="iva_factura")
    total_factura = models.DecimalField(max_digits=12, decimal_places=2, db_column="total_factura")
    estado_factura = models.CharField(max_length=50, db_column="estado_factura")
    ruta_pdf_factura = models.CharField(max_length=255, db_column="ruta_pdf_factura")

    class Meta:
        db_table = "factura"
        managed = False

    def __str__(self):
        return self.numero_factura
    
class NotaCredito(models.Model):
    ESTADO_CHOICES = [
        ("PENDIENTE", "Pendiente"),
        ("EMITIDA", "Emitida"),
        ("ANULADA", "Anulada"),
    ]

    id = models.AutoField(
        primary_key=True,
        db_column="id_nc",
    )

    id_factura = models.ForeignKey(
        Factura,
        on_delete=models.PROTECT,
        db_column="id_factura",
        related_name="notas_credito",
    )

    numero_nc = models.CharField(
        max_length=50,
        unique=True,
        db_column="numero_nc",
    )

    fecha_emision = models.DateField(
        db_column="fecha_emision_nc",
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        db_column="subtotal_nc",
    )

    iva = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        db_column="iva_nc",
    )

    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        db_column="total_nc",
    )

    motivo = models.TextField(
        db_column="motivo_nc",
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default="EMITIDA",
        db_column="estado_nc",
    )

    ruta_pdf_nc = models.CharField(
        max_length=255,
        blank=True,
        default="",
        db_column="ruta_pdf_nc",
    )

    creado_en = models.DateTimeField(
        auto_now_add=True,
        db_column="creado_en_nc",
    )

    class Meta:
        db_table = "nota_credito"
        managed = False
        ordering = ["-fecha_emision", "-id"]
        indexes = [
            models.Index(fields=["id_factura"]),
            models.Index(fields=["numero_nc"]),
        ]

    def __str__(self):
        return f"NC {self.numero_nc} - Factura {self.id_factura.numero_factura}"

    def calcular_totales(self, subtotal_bruto):
        """
        Recibe el subtotal ingresado por el usuario (positivo),
        calcula IVA (19%) y total, y los asigna al modelo.
        Los montos se guardan en positivo; el front los muestra
        con signo negativo si lo desea.
        """
        subtotal = Decimal(str(subtotal_bruto)).quantize(Decimal("0.01"))
        iva = (subtotal * Decimal("0.19")).quantize(Decimal("0.01"))
        self.subtotal = subtotal
        self.iva = iva
        self.total = subtotal + iva