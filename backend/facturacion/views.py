# backend/facturacion/views.py

import os
import logging
from io import BytesIO
from decimal import Decimal
from xml.sax.saxutils import escape

logger = logging.getLogger(__name__)

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils import timezone

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


from supabase import create_client

from usuarios.permissions import PermisoModulo
from .models import Factura, OrdenCompra
from .serializers import FacturaSerializer, OrdenCompraSerializer


# ============================================================
# SUPABASE STORAGE
# ============================================================


def obtener_cliente_supabase():
    url = os.getenv("SUPABASE_URL") or getattr(
        settings, "SUPABASE_URL", ""
    )

    clave = (
        os.getenv("SUPABASE_SECRET_KEY")
        or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or getattr(settings, "SUPABASE_SECRET_KEY", "")
        or getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", "")
    )

    if not url or not clave:
        raise RuntimeError(
            "Faltan SUPABASE_URL o una clave secreta de Supabase "
            "en la configuración del backend."
        )

    return create_client(url, clave)



def obtener_nombre_bucket():
    return (
        os.getenv("SUPABASE_STORAGE_BUCKET")
        or getattr(settings, "SUPABASE_STORAGE_BUCKET", "")
        or "facturas-pdf"
    )


# ============================================================
# UTILIDADES PDF
# ============================================================

def formato_moneda(valor):
    """
    Formato chileno: $10.000,00.
    Conserva los decimales almacenados en la base de datos.
    """
    numero = Decimal(str(valor or 0))
    texto = f"{numero:,.2f}"
    texto = texto.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"${texto}"


def generar_pdf_factura(factura):
    """
    Genera un PDF en memoria con los datos reales de la factura.
    No crea ni modifica la factura ni sus detalles.
    """
    buffer = BytesIO()

    documento = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title=f"Factura {factura.numero_factura}",
        author="Sistema Ecoterra",
    )

    estilos = getSampleStyleSheet()

    titulo = ParagraphStyle(
        "TituloFactura",
        parent=estilos["Title"],
        alignment=TA_CENTER,
        fontSize=19,
        leading=24,
        textColor=colors.HexColor("#1F5135"),
        spaceAfter=12,
    )

    texto_normal = ParagraphStyle(
        "TextoFactura",
        parent=estilos["Normal"],
        fontSize=9,
        leading=13,
    )

    texto_derecha = ParagraphStyle(
        "TextoDerecha",
        parent=texto_normal,
        alignment=TA_RIGHT,
    )

    texto_centro = ParagraphStyle(
        "TextoCentro",
        parent=texto_normal,
        alignment=TA_CENTER,
    )

    elementos = [
        Paragraph("FACTURA", titulo),
        Paragraph(
            f"<b>Número:</b> {escape(str(factura.numero_factura))}",
            texto_normal,
        ),
        Paragraph(
            f"<b>Fecha de emisión:</b> "
            f"{factura.fecha_emision.strftime('%d-%m-%Y')}",
            texto_normal,
        ),
        Paragraph(
            f"<b>Estado:</b> {escape(str(factura.estado))}",
            texto_normal,
        ),
        Spacer(1, 8 * mm),
        Paragraph("DATOS DEL CLIENTE", estilos["Heading2"]),
        Paragraph(
            escape(str(
                getattr(factura.id_cliente, "razon_social", "")
                or "Cliente"
            )),
            texto_normal,
        ),
        Spacer(1, 5 * mm),
    ]

    orden = factura.id_orden_compra
    numero_oc = getattr(orden, "numero_oc", None) or orden.pk

    elementos.extend([
        Paragraph("ORDEN DE COMPRA", estilos["Heading2"]),
        Paragraph(
            f"Número de orden: {escape(str(numero_oc))}",
            texto_normal,
        ),
        Spacer(1, 6 * mm),
        Paragraph("DETALLE DE PRODUCTOS", estilos["Heading2"]),
        Spacer(1, 2 * mm),
    ])

    detalles = factura.detalles.select_related("id_producto").all()

    datos_tabla = [[
        Paragraph("<b>Producto / descripción</b>", texto_normal),
        Paragraph("<b>Cantidad</b>", texto_centro),
        Paragraph("<b>Precio unitario</b>", texto_derecha),
        Paragraph("<b>Subtotal</b>", texto_derecha),
    ]]

    for detalle in detalles:
        descripcion = (
            getattr(detalle, "descripcion_df", None)
            or getattr(detalle.id_producto, "nombre_producto", None)
            or str(detalle.id_producto)
        )

        datos_tabla.append([
            Paragraph(escape(str(descripcion)), texto_normal),
            Paragraph(str(detalle.cantidad), texto_centro),
            Paragraph(formato_moneda(detalle.precio_unitario), texto_derecha),
            Paragraph(formato_moneda(detalle.subtotal_df), texto_derecha),
        ])

    tabla = Table(
        datos_tabla,
        colWidths=[83 * mm, 22 * mm, 32 * mm, 32 * mm],
        repeatRows=1,
    )

    tabla.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F5135")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D0D7D2")),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))

    elementos.extend([
        tabla,
        Spacer(1, 8 * mm),
    ])

    resumen = [
        ["Subtotal:", formato_moneda(factura.subtotal)],
        ["IVA (19%):", formato_moneda(factura.iva)],
        ["TOTAL:", formato_moneda(factura.total)],
    ]

    tabla_resumen = Table(
        [
            [
                Paragraph(
                    f"<b>{etiqueta}</b>",
                    texto_derecha,
                ),
                Paragraph(
                    f"<b>{valor}</b>" if etiqueta == "TOTAL:" else valor,
                    texto_derecha,
                ),
            ]
            for etiqueta, valor in resumen
        ],
        colWidths=[130 * mm, 39 * mm],
    )

    tabla_resumen.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("LINEABOVE", (0, 2), (-1, 2), 1, colors.HexColor("#1F5135")),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))

    elementos.append(tabla_resumen)

    documento.build(elementos)
    buffer.seek(0)

    return buffer.getvalue()


# ============================================================
# ÓRDENES DE COMPRA
# ============================================================

class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenCompra.objects.select_related(
        "id_cliente",
    ).all()

    serializer_class = OrdenCompraSerializer


# ============================================================
# FACTURAS
# ============================================================

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.select_related(
        "id_cliente",
        "id_orden_compra",
    ).all()

    serializer_class = FacturaSerializer
    permission_classes = [PermisoModulo]

    permisos_por_metodo = {
        "GET": ("facturacion", "Consultar"),
        "HEAD": ("facturacion", "Consultar"),
        "OPTIONS": ("facturacion", "Consultar"),
        "POST": ("facturacion", "Crear"),
        "PUT": ("facturacion", "Editar"),
        "PATCH": ("facturacion", "Editar"),
        "DELETE": ("facturacion", "Eliminar"),
    }

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                self.perform_create(serializer)
        except IntegrityError:
            return Response(
                {
                    "error": (
                        "No se pudo crear la factura. "
                        "Comprueba que la orden no tenga ya una factura "
                        "y que el número de factura sea único."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        headers = self.get_success_headers(serializer.data)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    # --------------------------------------------------------
    # GENERAR Y SUBIR PDF
    # POST /api/facturas/{id}/generar-pdf/
    # --------------------------------------------------------

    @action(
        detail=True,
        methods=["post"],
        url_path="generar-pdf",
    )
    
    def generar_pdf(self, request, pk=None):
        factura = self.get_object()

        try:
            contenido_pdf = generar_pdf_factura(factura)

            cliente_supabase = obtener_cliente_supabase()
            bucket = obtener_nombre_bucket()

            ruta_storage = f"facturas/{factura.numero_factura}.pdf"

            cliente_supabase.storage.from_(bucket).upload(
                ruta_storage,
                contenido_pdf,
                file_options={
                    "content-type": "application/pdf",
                    "upsert": "true",
                },
            )

            factura.ruta_pdf_factura = ruta_storage
            factura.save(update_fields=["ruta_pdf_factura"])

            return Response(
                {
                    "mensaje": "PDF generado y guardado correctamente.",
                    "numero_factura": factura.numero_factura,
                    "ruta_pdf_factura": factura.ruta_pdf_factura,
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            logger.exception("Error al generar o guardar el PDF de la factura")
            return Response(
                {
                    "error": (
                        "No se pudo generar o guardar el PDF. "
                        "Revisa la configuración de Supabase Storage "
                        "y los registros del backend."
                    )
                },
                status=500,
            )


    # --------------------------------------------------------
    # OBTENER URL FIRMADA TEMPORAL
    # GET /api/facturas/{id}/pdf/
    # --------------------------------------------------------

    @action(
        detail=True,
        methods=["get"],
        url_path="pdf",
    )
    def obtener_pdf(self, request, pk=None):
        factura = self.get_object()

        if not factura.ruta_pdf_factura:
            return Response(
                {
                    "error": (
                        "Esta factura todavía no tiene un PDF guardado. "
                        "Primero debes generarlo."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            cliente_supabase = obtener_cliente_supabase()
            bucket = obtener_nombre_bucket()

            resultado = (
                cliente_supabase.storage
                .from_(bucket)
                .create_signed_url(
                    factura.ruta_pdf_factura,
                    300,
                )
            )

            url_firmada = (
                resultado.get("signedURL")
                or resultado.get("signedUrl")
            )

            if not url_firmada:
                raise RuntimeError(
                    "Supabase no devolvió una URL firmada."
                )

            if url_firmada.startswith("/"):
                base_url = (
                    os.getenv("SUPABASE_URL")
                    or getattr(settings, "SUPABASE_URL", "")
                )
                url_firmada = base_url.rstrip("/") + url_firmada

            return Response(
                {
                    "numero_factura": factura.numero_factura,
                    "url": url_firmada,
                    "expira_en_segundos": 300,
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "error": (
                        "No se pudo generar el enlace temporal del PDF. "
                        "Revisa la configuración de Storage y "
                        "los registros del backend."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

    # --------------------------------------------------------
    # ACTUALIZAR ESTADO DE FACTURA
    # PATCH /api/facturas/{id}/acciones/
    # --------------------------------------------------------

    @action(
        detail=True,
        methods=["patch"],
        url_path="acciones",
    )
    def estado(self, request, pk=None):
        factura = self.get_object()
        nuevo_estado = request.data.get("estado")

        estados_validos = [
            opcion[0]
            for opcion in Factura.ESTADO_CHOICES
        ]

        if nuevo_estado not in estados_validos:
            return Response(
                {
                    "error": "Estado no válido.",
                    "estados_permitidos": estados_validos,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        factura.estado = nuevo_estado
        factura.save(update_fields=["estado"])

        return Response(
            FacturaSerializer(factura).data,
            status=status.HTTP_200_OK,
        )
