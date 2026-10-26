from datetime import date
from decimal import Decimal

from django.apps import apps
from django.test import TestCase
from rest_framework.test import APIClient

from clientes.models import Cliente
from config.test_support import SalesTablesMixin
from facturacion.models import Factura
from usuarios.authentication import crear_token
from usuarios.models import Usuario
from .models import OrdenCompra


class DistribucionVentasTests(SalesTablesMixin, TestCase):
    def setUp(self):
        self.api = APIClient()
        admin = Usuario.objects.create(
            nombre="Admin ventas", email="ventas@example.com", id_rol=1,
        )
        self.api.credentials(HTTP_AUTHORIZATION=f"Bearer {crear_token(admin)}")
        self.cliente = Cliente.objects.create(
            rut="76123456-7", razon_social="Cliente ventas", ciudad="Santiago",
            telefono="123", email="cliente-ventas@example.com",
        )

    def test_tablas_tienen_un_solo_modelo_registrado(self):
        for tabla, esperado in (("orden_compra", OrdenCompra), ("factura", Factura)):
            modelos = [model for model in apps.get_models() if model._meta.db_table == tabla]
            self.assertEqual(modelos, [esperado])
        self.assertIs(Factura._meta.get_field("id_orden_compra").related_model, OrdenCompra)

    def test_ambas_rutas_crean_y_consultan_el_mismo_modelo(self):
        for ruta, fecha, identificador in (
            ("ordenes-compra", "fecha_oc", "id_oc"),
            ("orden-compras", "fecha_orden", "id"),
        ):
            with self.subTest(ruta=ruta):
                respuesta = self.api.post(f"/api/{ruta}/", {
                    "id_cliente": self.cliente.pk, "numero_oc": f"OC-{ruta}",
                    fecha: "2026-10-25", "ruta_documento_oc": "orden.pdf",
                }, format="json")
                self.assertEqual(respuesta.status_code, 201, respuesta.data)
                orden = OrdenCompra.objects.get(pk=respuesta.data[identificador])
                self.assertEqual(orden.fecha_oc, date(2026, 10, 25))
                for consulta in ("ordenes-compra", "orden-compras"):
                    respuesta = self.api.get(f"/api/{consulta}/{orden.pk}/")
                    self.assertEqual(respuesta.status_code, 200, respuesta.data)
                    self.assertEqual(respuesta.data["numero_oc"], orden.numero_oc)

    def test_ambas_rutas_protegen_ordenes_facturadas(self):
        orden = OrdenCompra.objects.create(
            id_cliente=self.cliente, numero_oc="OC-FACTURADA",
            fecha_oc=date(2026, 10, 25), ruta_documento_oc="orden.pdf",
        )
        Factura.objects.create(
            id_orden_compra=orden, id_cliente=self.cliente, numero_factura="F-TEST",
            subtotal=Decimal("100"), iva=Decimal("19"), total=Decimal("119"),
        )
        for ruta in ("ordenes-compra", "orden-compras"):
            respuesta = self.api.delete(f"/api/{ruta}/{orden.pk}/")
            self.assertEqual(respuesta.status_code, 400, respuesta.data)
        self.assertTrue(OrdenCompra.objects.filter(pk=orden.pk).exists())

    def test_ruta_historica_exige_autenticacion(self):
        self.assertEqual(APIClient().get("/api/orden-compras/").status_code, 401)
