from django.db import models


class Cliente(models.Model):
    class Estado(models.TextChoices):
        ACTIVO = "Activo", "Activo"
        INACTIVO = "Inactivo", "Inactivo"

    rut = models.CharField(max_length=12, unique=True)
    razon_social = models.CharField(max_length=200)
    nombre_fantasia = models.CharField(max_length=200, blank=True)
    ciudad = models.CharField(max_length=100)
    telefono = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    representante = models.CharField(max_length=150, blank=True)
    estado = models.CharField(
        max_length=10,
        choices=Estado.choices,
        default=Estado.ACTIVO,
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["razon_social"]
        verbose_name = "cliente"
        verbose_name_plural = "clientes"

    def __str__(self):
        return f"{self.razon_social} ({self.rut})"


class Direccion(models.Model):
    class Tipo(models.TextChoices):
        DESPACHO = "Despacho", "Despacho"
        FACTURACION = "Facturación", "Facturación"
        OTRO = "Otro", "Otro"

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name="direcciones",
    )
    nombre = models.CharField(max_length=200)
    ciudad = models.CharField(max_length=100)
    tipo = models.CharField(max_length=12, choices=Tipo.choices)
    principal = models.BooleanField(default=False)

    class Meta:
        ordering = ["-principal", "nombre"]
        constraints = [
            models.UniqueConstraint(
                fields=["cliente"],
                condition=models.Q(principal=True),
                name="unique_principal_address_per_client",
            )
        ]
        verbose_name = "dirección"
        verbose_name_plural = "direcciones"

    def __str__(self):
        return f"{self.nombre} - {self.ciudad}"
