from django.db import IntegrityError
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

    def test_unica_direccion_principal_por_cliente(self):
        cliente = Cliente.objects.create(
            rut="76.987.654-5",
            razon_social="Mina Norte Ltda.",
            ciudad="Antofagasta",
        )

        Direccion.objects.create(
            cliente=cliente,
            nombre="Patio principal",
            ciudad="Antofagasta",
            tipo=Direccion.Tipo.DESPACHO,
            principal=True,
        )

        with self.assertRaises(IntegrityError):
            Direccion.objects.create(
                cliente=cliente,
                nombre="Sucursal secundaria",
                ciudad="Antofagasta",
                tipo=Direccion.Tipo.OTRO,
                principal=True,
            )
