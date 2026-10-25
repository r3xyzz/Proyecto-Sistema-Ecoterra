"""Pruebas de aceptación S4-T01 sobre una base SQLite aislada."""
from copy import deepcopy
from datetime import date
from decimal import Decimal
from unittest.mock import patch

from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APIClient

from config.test_support import SalesTablesMixin
from clientes.models import Cliente
from inventario.models import Producto
from usuarios.models import Usuario
from usuarios.authentication import crear_token
from .models import Factura, DetalleFactura, OrdenCompra


class FacturacionAcceptanceTests(SalesTablesMixin, TestCase):
    def setUp(self):
        self.api = APIClient()
        self.admin = Usuario.objects.create(nombre="Admin S4-T01", email="s4t01@example.com", id_rol=1)
        self.api.credentials(HTTP_AUTHORIZATION=f"Bearer {crear_token(self.admin)}")
        self.customer = Cliente.objects.create(rut="76123456-7", razon_social="Cliente QA S4-T01",
            ciudad="Santiago", telefono="123", email="customer@example.com")
        self.other_customer = Cliente.objects.create(rut="11111111-1", razon_social="Otro cliente",
            ciudad="Santiago", telefono="456", email="other@example.com")
        self.product = Producto.objects.create(codigo="QA-FAC-1", nombre="Polímero agrícola",
                                               tipo="Control", unidad="Litros")
        self.second_product = Producto.objects.create(codigo="QA-FAC-2", nombre="Control de polvo",
                                                      tipo="Control", unidad="Litros")
        self.order = OrdenCompra.objects.create(id_cliente=self.customer, numero_oc="OC-QA-S4T01",
            fecha_orden=date(2026, 10, 25), ruta_documento_oc="")
        self.payload = {"cliente_id": self.customer.pk, "id_oc": self.order.pk,
            "detalles": [{"id_producto": self.product.pk, "cantidad": "2.00", "precio_unitario": "1000.00"}]}

    def create(self, payload=None):
        return self.api.post("/api/facturas/", deepcopy(payload or self.payload), format="json")

    def invoice(self):
        response = self.create()
        self.assertEqual(response.status_code, 201, response.data)
        return Factura.objects.get(pk=response.data["id"])

    def test_01_create_associates_order_customer_and_product(self):
        invoice = self.invoice()
        self.assertEqual(invoice.id_cliente_id, self.customer.pk)
        self.assertEqual(invoice.id_orden_compra_id, self.order.pk)
        detail = invoice.detalles.get()
        self.assertEqual(detail.id_producto_id, self.product.pk)
        self.assertEqual(detail.cantidad, Decimal("2.00"))
        self.assertEqual(detail.precio_unitario, Decimal("1000.00"))
        self.assertEqual(detail.subtotal_df, Decimal("2000.00"))

    def test_02_totals_and_default_state(self):
        invoice = self.invoice()
        self.assertEqual((invoice.subtotal, invoice.iva, invoice.total),
                         (Decimal("2000.00"), Decimal("380.00"), Decimal("2380.00")))
        self.assertEqual(invoice.estado, "PENDIENTE")
        self.assertTrue(invoice.numero_factura.startswith("F-"))
        self.assertNotIn("TMP-", invoice.numero_factura)
        self.assertIsNotNone(invoice.fecha_emision)

    def test_03_multiple_products_decimal_rounding(self):
        self.payload["detalles"] = [
            {"id_producto": self.product.pk, "cantidad": "1.25", "precio_unitario": "100.10"},
            {"id_producto": self.second_product.pk, "cantidad": "2.00", "precio_unitario": "20.20"},
        ]
        invoice = self.invoice()
        self.assertEqual(invoice.detalles.count(), 2)
        self.assertEqual((invoice.subtotal, invoice.iva, invoice.total),
                         (Decimal("165.52"), Decimal("31.45"), Decimal("196.97")))

    def test_04_accepts_frontend_field_aliases(self):
        self.payload["id_orden_compra"] = self.payload.pop("id_oc")
        line = self.payload["detalles"][0]
        line["producto_id"] = line.pop("id_producto")
        self.invoice()

    def test_05_accepts_id_cliente_alias(self):
        self.payload["id_cliente"] = self.payload.pop("cliente_id")
        self.invoice()

    def test_06_list_and_retrieve_include_details(self):
        invoice = self.invoice()
        for url in ("/api/facturas/", f"/api/facturas/{invoice.pk}/"):
            response = self.api.get(url)
            self.assertEqual(response.status_code, 200)
            data = response.data[0] if isinstance(response.data, list) else response.data
            self.assertEqual(data["cliente_nombre"], self.customer.razon_social)
            self.assertEqual(data["oc_numero"], self.order.numero_oc)
            self.assertEqual(len(data["detalles_factura"]), 1)

    def test_07_product_name_is_returned_in_detail(self):
        invoice = self.invoice()
        response = self.api.get(f"/api/facturas/{invoice.pk}/")
        self.assertEqual(response.data["detalles_factura"][0]["producto_nombre"], self.product.nombre)

    def test_08_customer_must_match_order(self):
        self.payload["cliente_id"] = self.other_customer.pk
        self.assertEqual(self.create().status_code, 400)
        self.assertEqual(Factura.objects.count(), 0)

    def test_09_required_fields(self):
        for field in ("cliente_id", "id_oc", "detalles"):
            with self.subTest(field=field):
                payload = deepcopy(self.payload)
                payload.pop(field)
                self.assertEqual(self.create(payload).status_code, 400)
        self.assertEqual(Factura.objects.count(), 0)

    def test_10_empty_details_are_rejected(self):
        self.payload["detalles"] = []
        self.assertEqual(self.create().status_code, 400)

    def test_11_duplicate_products_are_rejected(self):
        self.payload["detalles"] *= 2
        self.assertEqual(self.create().status_code, 400)
        self.assertEqual(DetalleFactura.objects.count(), 0)

    def test_12_invalid_quantities_are_rejected(self):
        for value in ("0", "-1", "0.001", "abc", "NaN", "Infinity", "10000000000"):
            with self.subTest(quantity=value):
                self.payload["detalles"][0]["cantidad"] = value
                self.assertEqual(self.create().status_code, 400)
        self.assertEqual(Factura.objects.count(), 0)

    def test_13_invalid_prices_are_rejected(self):
        for value in ("-1", "0.001", "abc", "NaN", "Infinity", "10000000000"):
            with self.subTest(price=value):
                self.payload["detalles"][0]["precio_unitario"] = value
                self.assertEqual(self.create().status_code, 400)

    def test_14_zero_price_matches_model_and_frontend_rule(self):
        self.payload["detalles"][0]["precio_unitario"] = "0"
        self.assertEqual(self.create().status_code, 400)

    def test_15_nonexistent_relations_are_rejected(self):
        for field in ("cliente_id", "id_oc", "id_producto"):
            with self.subTest(field=field):
                payload = deepcopy(self.payload)
                target = payload["detalles"][0] if field == "id_producto" else payload
                target[field] = 999999
                self.assertEqual(self.create(payload).status_code, 400)

    def test_16_client_cannot_override_totals_number_state_or_pdf_path(self):
        self.payload.update(subtotal="1", iva="1", total="1", numero_factura="INJECTED",
                            estado="PAGADA", ruta_pdf_factura="foreign.pdf", total_factura="1")
        invoice = self.invoice()
        self.assertEqual(invoice.total, Decimal("2380"))
        self.assertNotEqual(invoice.numero_factura, "INJECTED")
        self.assertEqual(invoice.estado, "PENDIENTE")
        self.assertEqual(invoice.ruta_pdf_factura, "")

    def test_17_one_invoice_per_order(self):
        self.invoice()
        response = self.create()
        self.assertIn(response.status_code, (400, 409))
        self.assertEqual(Factura.objects.filter(id_orden_compra=self.order).count(), 1)

    def test_18_number_is_unique_for_different_orders(self):
        first = self.invoice()
        second_order = OrdenCompra.objects.create(id_cliente=self.customer, numero_oc="OC-QA-2",
            fecha_orden=date(2026, 10, 25), ruta_documento_oc="")
        self.payload["id_oc"] = second_order.pk
        second = self.invoice()
        self.assertNotEqual(first.numero_factura, second.numero_factura)

    def test_19_all_supported_states_persist(self):
        invoice = self.invoice()
        for state in ("EMITIDA", "PAGADA", "ANULADA", "PENDIENTE"):
            response = self.api.patch(f"/api/facturas/{invoice.pk}/acciones/", {"estado": state}, format="json")
            self.assertEqual(response.status_code, 200, response.data)
            invoice.refresh_from_db()
            self.assertEqual(invoice.estado, state)

    def test_20_invalid_state_does_not_change_record(self):
        invoice = self.invoice()
        for value in ("INVALIDO", "", None):
            response = self.api.patch(f"/api/facturas/{invoice.pk}/acciones/", {"estado": value}, format="json")
            self.assertEqual(response.status_code, 400)
        invoice.refresh_from_db()
        self.assertEqual(invoice.estado, "PENDIENTE")

    def test_21_anonymous_and_invalid_token_are_rejected(self):
        api = APIClient()
        for token in (None, "invalid"):
            api.credentials(**({"HTTP_AUTHORIZATION": f"Bearer {token}"} if token else {}))
            self.assertEqual(api.get("/api/facturas/").status_code, 401)
            self.assertEqual(api.post("/api/facturas/", self.payload, format="json").status_code, 401)

    def test_22_user_without_permission_is_rejected(self):
        user = Usuario.objects.create(nombre="Sin permiso", email="denied@example.com", id_rol=3)
        self.api.credentials(HTTP_AUTHORIZATION=f"Bearer {crear_token(user)}")
        with patch("usuarios.permissions.tiene_permiso", return_value=False):
            self.assertEqual(self.api.get("/api/facturas/").status_code, 403)
            self.assertEqual(self.create().status_code, 403)

    def test_23_missing_invoice_returns_404(self):
        self.assertEqual(self.api.get("/api/facturas/999999/").status_code, 404)
        self.assertEqual(self.api.patch("/api/facturas/999999/acciones/", {"estado":"PAGADA"}, format="json").status_code, 404)

    def test_24_creation_is_atomic_on_detail_failure(self):
        with patch("facturacion.serializers.DetalleFactura.objects.create", side_effect=IntegrityError("test")):
            response = self.create()
        self.assertEqual(response.status_code, 409)
        self.assertEqual(Factura.objects.count(), 0)
        self.assertEqual(DetalleFactura.objects.count(), 0)

    def test_25_delete_cascades_to_details_in_test_database(self):
        invoice = self.invoice()
        response = self.api.delete(f"/api/facturas/{invoice.pk}/")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Factura.objects.count(), 0)
        self.assertEqual(DetalleFactura.objects.count(), 0)
        self.assertTrue(Cliente.objects.filter(pk=self.customer.pk).exists())
        self.assertTrue(Producto.objects.filter(pk=self.product.pk).exists())

    def test_26_recalculate_without_saving(self):
        invoice = self.invoice()
        invoice.detalles.update(subtotal_df=Decimal("3000"))
        invoice.recalcular_totales(guardar=False)
        self.assertEqual(invoice.total, Decimal("3570"))
        invoice.refresh_from_db()
        self.assertEqual(invoice.total, Decimal("2380"))

    def test_27_unsaved_invoice_cannot_recalculate(self):
        with self.assertRaises(ValueError):
            Factura().recalcular_totales()

    def test_28_general_patch_of_details_does_not_return_500(self):
        invoice = self.invoice()
        api = APIClient(raise_request_exception=False)
        api.credentials(HTTP_AUTHORIZATION=f"Bearer {crear_token(self.admin)}")
        response = api.patch(f"/api/facturas/{invoice.pk}/", self.payload, format="json")
        self.assertLess(response.status_code, 500)
