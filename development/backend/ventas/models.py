from django.db import models


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