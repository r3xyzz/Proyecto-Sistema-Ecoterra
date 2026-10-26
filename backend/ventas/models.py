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
