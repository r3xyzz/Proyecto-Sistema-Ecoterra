from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APIClient

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

    def test_endpoint_api_devuelve_clientes(self):
        cliente = Cliente.objects.create(
            rut="77.123.456-1",
            razon_social="EcoTerra Operaciones",
            ciudad="Valparaíso",
            telefono="+56 9 1234 5678",
            email="contacto@ecoterra.cl",
            representante="María Pérez",
        )
        Direccion.objects.create(
            cliente=cliente,
            nombre="Oficina central",
            ciudad="Valparaíso",
            tipo=Direccion.Tipo.DESPACHO,
            principal=True,
        )

        response = APIClient().get("/api/clientes/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["rut"], "77.123.456-1")
        self.assertEqual(response.data[0]["direcciones"][0]["nombre"], "Oficina central")

    def test_endpoint_api_crea_y_elimina_cliente(self):
        api = APIClient()

        create_response = api.post(
            "/api/clientes/",
            {
                "rut": "78.456.123-9",
                "razon_social": "Minería Sur SA",
                "nombre_fantasia": "Minería Sur",
                "ciudad": "Temuco",
                "telefono": "+56 9 2222 3333",
                "email": "contacto@mineriasur.cl",
                "representante": "Luis Vega",
                "estado": "Activo",
            },
            format="json",
        )

        self.assertEqual(create_response.status_code, 201)
        cliente_id = create_response.data["id"]
        self.assertEqual(create_response.data["razon_social"], "Minería Sur SA")

        delete_response = api.delete(f"/api/clientes/{cliente_id}/")

        self.assertEqual(delete_response.status_code, 204)
        self.assertFalse(Cliente.objects.filter(id=cliente_id).exists())
