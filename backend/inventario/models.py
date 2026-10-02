from django.db import models


class Producto(models.Model):
    id = models.AutoField(primary_key=True, db_column="id_producto")
    codigo = models.CharField(max_length=30, db_column="codigo_producto")
    nombre = models.CharField(max_length=150, db_column="nombre_producto")
    descripcion = models.TextField(db_column="descripcion_producto", blank=True, null=True)
    tipo = models.CharField(max_length=80, db_column="tipo_producto")
    unidad = models.CharField(max_length=30, db_column="unidad_medida_producto")
    stock_minimo = models.DecimalField(max_digits=12, decimal_places=2, db_column="stock_minimo_producto")

    class Meta:
        db_table = "producto"
        managed = False
        ordering = ["codigo"]


class Inventario(models.Model):
    id = models.AutoField(primary_key=True, db_column="id_inventario")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, db_column="id_producto", related_name="existencias")
    lote = models.CharField(max_length=30, db_column="lote_inventario")
    cantidad = models.DecimalField(max_digits=12, decimal_places=2, db_column="cantidad_inventario")
    envase = models.CharField(max_length=50, db_column="envase_inventario")
    fecha_fabricacion = models.DateField(db_column="fecha_fabricacion_inventario")
    fecha_vencimiento = models.DateField(db_column="fecha_vencimiento_inventario")
    ubicacion = models.CharField(max_length=50, db_column="ubicacion_inventario")
    estado = models.CharField(max_length=20, db_column="estado_inventario")

    class Meta:
        db_table = "inventario"
        managed = False
        ordering = ["fecha_vencimiento", "lote"]
