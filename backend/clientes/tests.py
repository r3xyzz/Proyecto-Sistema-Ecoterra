from django.test import TestCase

from .models import Cliente, Direccion


class ClienteModelTests(TestCase):
    def test_cliente_puede_tener_varias_direcciones(self):
        cliente = Cliente.objects.create(
            rut="76.123.456-7",
            razon_social="EcoTerra SpA",
            ciudad="Santiago",
        )
        Direccion.objects.create(
            cliente=cliente,
            nombre="Bodega principal",
            ciudad="Santiago",
            tipo=Direccion.Tipo.DESPACHO,
            principal=True,
        )
        Direccion.objects.create(
            cliente=cliente,
            nombre="Oficina administrativa",
            ciudad="Santiago",
            tipo=Direccion.Tipo.FACTURACION,
        )

        self.assertEqual(cliente.direcciones.count(), 2)
        self.assertEqual(cliente.direcciones.first().nombre, "Bodega principal")
