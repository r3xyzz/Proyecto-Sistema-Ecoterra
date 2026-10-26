from django.db import connection


class SalesTablesMixin:
    """Tablas unmanaged disponibles exclusivamente durante cada clase de tests."""
    @classmethod
    def setUpClass(cls):
        from cotizaciones.models import Cotizacion, DetalleCotizacion
        from facturacion.models import Factura, DetalleFactura
        from ventas.models import OrdenCompra, NotaCredito

        cls.created_tables = []
        with connection.schema_editor() as editor:
            for model in (Cotizacion, DetalleCotizacion, OrdenCompra, Factura, DetalleFactura, NotaCredito):
                if model._meta.db_table not in connection.introspection.table_names():
                    editor.create_model(model)
                    cls.created_tables.append(model)
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        with connection.schema_editor() as editor:
            for model in reversed(cls.created_tables):
                editor.delete_model(model)
