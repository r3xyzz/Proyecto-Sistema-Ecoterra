// src/modules/Facturacion.tsx
import React, { useEffect, useState } from "react"
import { getDocumentPdfUrl } from "../documentPdf"
import {
  Badge,
  fmtCLP,
  I,
  Ico,
  PageTitle,
  AuthUser,
  authHeaders,
} from "../shared"

export type Invoice = {
  id: string
  id_interno?: number
  oc: string
  cliente: string
  fecha: string
  venc: string
  subtotal: number
  iva: number
  total: number
  estado: string
}

type ProductoAPI = {
  id: number
  codigo: string
  nombre: string
  unidad: string
  estado?: string | boolean
}

type ClienteOrdenAPI = {
  id?: number | string
  id_cliente?: number | string
  razon_social?: string
  razon_social_cliente?: string
}

type OrdenAPI = {
  id_oc: number | string
  id_cliente: number | string | ClienteOrdenAPI
  numero_oc?: string
  cliente_nombre?: string
  id_cotizacion?: number | string
  fecha_orden?: string
  fecha_oc?: string
  estado?: string
}

type DetalleForm = {
  producto_id: string
  cantidad: string
  precio_unitario: string
}

type FacturacionProps = {
  facturas: Invoice[]
  authUser: AuthUser | null
  onCreated: (invoice: Invoice) => void
}

// Traduce el código del estado de factura a su etiqueta o conserva el texto recibido.
const estadoLegible = (estado: string) => {
  const estados: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EMITIDA: "Emitida",
    ANULADA: "Anulada",
    PAGADA: "Pagada",
    VENCIDA: "Vencida",
  }

  return estados[estado?.toUpperCase()] || estado || "Pendiente"
}

// Crea una línea de factura vacía con cantidad inicial igual a uno.
const createDetalle = (): DetalleForm => ({
  producto_id: "",
  cantidad: "1",
  precio_unitario: "",
})

// Convierte el cuerpo de error de la API en un mensaje legible incluyendo el estado HTTP si falta contenido.
const errorDeRespuesta = (data: any, status: number) => {
  if (!data) return `Error del servidor (HTTP ${status}).`
  if (typeof data === "string") return data

  return (
    Object.entries(data)
      .map(/* Convierte un campo de error de la API y sus mensajes en texto legible. */ ([campo, valor]) => {
        const mensaje = Array.isArray(valor)
          ? valor.map(String).join(", ")
          : typeof valor === "string"
            ? valor
            : JSON.stringify(valor)

        return `${campo}: ${mensaje}`
      })
      .join(" | ") || `Error HTTP ${status}`
  )
}

// Extrae una lista directa o el campo results de una respuesta paginada y devuelve nulo si no hay lista.
const extraerLista = (data: any): any[] | null => {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return null
}

// Obtiene el identificador del cliente de una orden admitiendo relaciones por número u objeto.
const obtenerClienteId = (
  orden: OrdenAPI | undefined,
): string => {
  if (!orden) return ""

  const cliente = orden.id_cliente

  if (typeof cliente === "object" && cliente !== null) {
    const id = cliente.id_cliente ?? cliente.id
    return id === undefined || id === null ? "" : String(id)
  }

  return cliente === undefined || cliente === null
    ? ""
    : String(cliente)
}

// Obtiene el nombre del cliente de la orden usando los campos de nombre disponibles.
const obtenerNombreCliente = (
  orden: OrdenAPI | undefined,
): string => {
  if (!orden) return ""

  if (orden.cliente_nombre) return orden.cliente_nombre
  const cliente = orden.id_cliente

  if (typeof cliente === "object" && cliente !== null) {
    return (
      cliente.razon_social_cliente ??
      cliente.razon_social ??
      ""
    )
  }

  return ""
}

// Muestra las facturas y gestiona su creación con productos, su vista previa, correo y PDF.
export default function Facturacion({
  facturas,
  authUser,
  onCreated,
}: FacturacionProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(facturas)
  const [preview, setPreview] = useState<Invoice | null>(null)
  const [showNew, setShowNew] = useState(false)

  const [productos, setProductos] = useState<ProductoAPI[]>([])
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenAPI[]>([])
  const [detalles, setDetalles] = useState<DetalleForm[]>([
    createDetalle(),
  ])

  const [ordenSeleccionada, setOrdenSeleccionada] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(false)
  const [errorGuardado, setErrorGuardado] = useState("")
  const [errorCarga, setErrorCarga] = useState("")

  useEffect(/* Sincroniza la lista interna de facturas con las facturas recibidas por propiedades. */ () => {
    setInvoices(facturas)
  }, [facturas])

  useEffect(/* Carga productos y órdenes para la sesión actual y registra la cancelación al desmontarse. */ () => {
    if (!authUser) {
      setProductos([])
      setOrdenesCompra([])
      setErrorCarga("No se detectó una sesión activa.")
      return
    }

    let cancelado = false

    // Carga productos y órdenes para el formulario de factura evitando actualizar una vista desmontada.
    const cargarDatos = async () => {
      setCargandoDatos(true)
      setErrorCarga("")

      try {
        const headers = authHeaders(authUser)

        const [respuestaProductos, respuestaOrdenes] =
          await Promise.all([
            fetch("/api/productos/", { headers }),
            fetch("/api/ordenes-compra/", { headers }),
          ])

        const datosProductos = await respuestaProductos
          .json()
          .catch(/* Devuelve null cuando falla la operación anterior. */ () => null)

        const datosOrdenes = await respuestaOrdenes
          .json()
          .catch(/* Devuelve null cuando falla la operación anterior. */ () => null)

        if (!respuestaProductos.ok) {
          throw new Error(
            errorDeRespuesta(
              datosProductos,
              respuestaProductos.status,
            ),
          )
        }

        if (!respuestaOrdenes.ok) {
          throw new Error(
            errorDeRespuesta(
              datosOrdenes,
              respuestaOrdenes.status,
            ),
          )
        }

        const listaProductos = extraerLista(datosProductos)
        const listaOrdenes = extraerLista(datosOrdenes)

        if (!listaProductos || !listaOrdenes) {
          throw new Error(
            "La API no devolvió listas válidas de productos y órdenes de compra.",
          )
        }

        if (!cancelado) {
          setProductos(listaProductos)
          setOrdenesCompra(listaOrdenes)
        }
      } catch (error) {
        if (!cancelado) {
          setErrorCarga(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los datos.",
          )
        }
      } finally {
        if (!cancelado) setCargandoDatos(false)
      }
    }

    cargarDatos()

    return /* Marca la carga como cancelada para evitar actualizar el estado tras desmontar la vista. */ () => {
      cancelado = true
    }
  }, [authUser])

  const ordenActual = ordenesCompra.find(
  /* Identifica el elemento buscado evaluando String(orden.id_oc) === String(ordenSeleccionada). */ (orden) =>
    String(orden.id_oc) === String(ordenSeleccionada),
)

  const clienteId = obtenerClienteId(ordenActual)
  const nombreCliente = obtenerNombreCliente(ordenActual)

  const subtotalCalculado = detalles.reduce(
    /* Acumula el subtotal multiplicando la cantidad por el precio de cada detalle. */ (total, detalle) => {
      const cantidad = Number(detalle.cantidad) || 0
      const precio = Number(detalle.precio_unitario) || 0
      return total + cantidad * precio
    },
    0,
  )

  const ivaCalculado = Math.round(subtotalCalculado * 0.19)
  const totalCalculado = subtotalCalculado + ivaCalculado

  const totalFacturado = invoices.reduce(
    /* Acumula el resultado de la lista mediante sum + Number(invoice.total ?? invoice.subtotal + invoice.iva). */ (sum, invoice) =>
      sum + Number(invoice.total ?? invoice.subtotal + invoice.iva),
    0,
  )

  const pagadas = invoices.filter(
    /* Comprueba qué elementos cumplen la condición evaluando ["Pagada", "PAGADA"].includes(invoice.estado). */ (invoice) =>
      ["Pagada", "PAGADA"].includes(invoice.estado),
  ).length

  const pendientes = invoices.filter(
    /* Comprueba qué elementos cumplen la condición evaluando ["Pendiente", "PENDIENTE"].includes(invoice.estado). */ (invoice) =>
      ["Pendiente", "PENDIENTE"].includes(invoice.estado),
  ).length

  const vencidas = invoices.filter(
    /* Comprueba qué elementos cumplen la condición evaluando ["Vencida", "VENCIDA"].includes(invoice.estado). */ (invoice) =>
      ["Vencida", "VENCIDA"].includes(invoice.estado),
  ).length

  const invoiceCount = invoices.length

  // Reinicia la orden, los detalles y los errores y abre el formulario de nueva factura.
  const openNewInvoice = () => {
    setOrdenSeleccionada("")
    setDetalles([createDetalle()])
    setErrorGuardado("")
    setErrorCarga("")
    setShowNew(true)
  }

  // Cierra el formulario de factura y limpia el error si no hay un guardado en curso.
  const closeNewInvoice = () => {
    if (guardando) return
    setShowNew(false)
    setErrorGuardado("")
  }

  // Abre el cliente de correo con el asunto y el texto preparados para la factura.
  const sendInvoiceByMail = (invoice: Invoice) => {
    const subject = encodeURIComponent(
      `Factura ${invoice.id} · Ecoterra`,
    )

    const body = encodeURIComponent(
      `Estimado cliente, adjuntamos la factura ${invoice.id} por ${fmtCLP(
        invoice.total ?? invoice.subtotal + invoice.iva,
      )}.`,
    )

    window.location.href =
      `mailto:?subject=${subject}&body=${body}`
  }

  
// Resuelve el identificador interno de la factura y abre su PDF mediante el backend autenticado.
const downloadInvoicePdf = async (invoice: Invoice) => {
  const printWindow = window.open("about:blank", "_blank")

  if (!printWindow) {
    alert("Permite las ventanas emergentes para abrir el PDF.")
    return
  }

  if (!authUser) {
    printWindow.close()
    alert("Tu sesión ha expirado. Inicia sesión nuevamente.")
    return
  }

  printWindow.document.title = `Factura ${invoice.id}`
  printWindow.opener = null
  printWindow.document.body.textContent = "Cargando PDF..."

  try {
    const headers = authHeaders(authUser)

    // Buscar el ID interno de la factura en Django.
    const respuestaFacturas = await fetch("/api/facturas/", {
      headers,
    })

    const datosFacturas = await respuestaFacturas
      .json()
      .catch(/* Devuelve null cuando falla la operación anterior. */ () => null)

    if (!respuestaFacturas.ok) {
      throw new Error(
        errorDeRespuesta(datosFacturas, respuestaFacturas.status),
      )
    }

    const listaFacturas = extraerLista(datosFacturas)

    if (!listaFacturas) {
      throw new Error("La API no devolvió una lista de facturas válida.")
    }

    const facturaAPI = listaFacturas.find(
      /* Identifica el elemento buscado evaluando item.numero_factura === invoice.id. */ (item: any) =>
        item.numero_factura === invoice.id
    )

    if (!facturaAPI) {
      throw new Error(
        `No se encontró la factura ${invoice.id} en el backend.`
      )
    }

    const facturaId =
      facturaAPI.id_factura ?? facturaAPI.id

    if (facturaId === undefined || facturaId === null) {
      throw new Error("No se encontró el ID interno de la factura.")
    }

    printWindow.location.href = await getDocumentPdfUrl(`/api/facturas/${facturaId}`, authUser)
  } catch (error) {
    printWindow.close()

    alert(
      error instanceof Error
        ? error.message
        : "No se pudo abrir el PDF de la factura."
    )
  }
}


  // Valida sesión, orden y productos, crea la factura en la API y actualiza el listado local.
  const guardarFactura = async () => {
    setErrorGuardado("")

    if (!authUser) {
      setErrorGuardado(
        "No se detectó una sesión activa. Inicia sesión nuevamente.",
      )
      return
    }

    if (!ordenActual || !clienteId) {
      setErrorGuardado(
        "La orden seleccionada no tiene un cliente válido. Revisa los datos de /api/ordenes-compra/.",
      )
      return
    }

    if (!detalles.length) {
      setErrorGuardado("Agrega al menos un producto.")
      return
    }

    const detalleInvalido = detalles.some(
      /* Comprueba qué elementos cumplen la condición evaluando !detalle.producto_id || !detalle.cantidad || !detalle.precio_unitario || !Number.isFinite(Number(detalle.cantidad)) || !Number.isFinite(Number(detalle.precio_unitario)) || Number(detalle.cantidad) <= 0 || Number(detalle.precio_unitario) <= 0. */ (detalle) =>
        !detalle.producto_id ||
        !detalle.cantidad ||
        !detalle.precio_unitario ||
        !Number.isFinite(Number(detalle.cantidad)) ||
        !Number.isFinite(Number(detalle.precio_unitario)) ||
        Number(detalle.cantidad) <= 0 ||
        Number(detalle.precio_unitario) <= 0,
    )

    if (detalleInvalido) {
      setErrorGuardado(
        "Completa cada producto con una cantidad y un precio unitario mayores que cero.",
      )
      return
    }

    const idsProductos = detalles.map(
      /* Transforma cada elemento de la lista devolviendo detalle.producto_id. */ (detalle) => detalle.producto_id,
    )

    if (new Set(idsProductos).size !== idsProductos.length) {
      setErrorGuardado(
        "Hay productos repetidos. Combina sus cantidades en una sola línea.",
      )
      return
    }

    setGuardando(true)

    try {
      const respuesta = await fetch("/api/facturas/", {
        method: "POST",
        headers: {
          ...authHeaders(authUser),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          id_orden_compra: ordenActual.id_oc,
          ruta_pdf_factura: "",
          detalles: detalles.map(/* Transforma cada elemento de la lista devolviendo ({ producto_id: Number(detalle.producto_id), cantidad: Number(detalle.cantidad), precio_unitario: Number(detalle.precio_unitario), }). */ (detalle) => ({
            producto_id: Number(detalle.producto_id),
            cantidad: Number(detalle.cantidad),
            precio_unitario: Number(detalle.precio_unitario),
          })),
        }),
      })

      const data = await respuesta.json().catch(/* Devuelve null cuando falla la operación anterior. */ () => null)

      if (!respuesta.ok) {
        throw new Error(
          errorDeRespuesta(data, respuesta.status),
        )
      }

      const facturaCreada: Invoice = {
        id: String(data.numero_factura ?? data.id),
        oc: String(
          data.oc_numero ?? ordenActual.numero_oc ?? ordenActual.id_oc,
        ),
        cliente:
          data.cliente_nombre ||
          nombreCliente ||
          `Cliente ${clienteId}`,
        fecha: String(
          data.fecha_factura ?? data.fecha_emision ?? "",
        ),
        venc: String(data.fecha_factura ?? data.fecha_emision ?? ""),
        subtotal: Number(
          data.subtotal_factura ?? data.subtotal ?? 0,
        ),
        iva: Number(data.iva_factura ?? data.iva ?? 0),
        total: Number(data.total_factura ?? data.total ?? 0),
        estado: estadoLegible(
          data.estado_factura ?? data.estado ?? "PENDIENTE",
        ),
      }

      setInvoices(/* Calcula el nuevo valor de Invoices devolviendo [ facturaCreada, ...actuales.filter( (item) => item.id !== facturaCreada.id, ), ]. */ (actuales) => [
        facturaCreada,
        ...actuales.filter(
          /* Comprueba qué elementos cumplen la condición evaluando item.id !== facturaCreada.id. */ (item) => item.id !== facturaCreada.id,
        ),
      ])
      onCreated(facturaCreada)

      setPreview(facturaCreada)
      setShowNew(false)
      setOrdenSeleccionada("")
      setDetalles([createDetalle()])
      setErrorGuardado("")
    } catch (error) {
      setErrorGuardado(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la factura.",
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>
      <PageTitle
        title="Facturación"
        sub="Documentos tributarios electrónicos 1:1 con OC"
      >
        <button
          className="btn btn-primary"
          onClick={openNewInvoice}
        >
          <Ico p={I.plus} size={14} /> Nueva factura
        </button>
      </PageTitle>

      <div className="facturacion-kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Total facturado</div>
          <div className="kpi-value tabular">
            {fmtCLP(totalFacturado)}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Pagadas</div>
          <div className="kpi-value tabular">{pagadas}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value tabular facturacion-warning-value">
            {pendientes}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Vencidas</div>
          <div className="kpi-value tabular facturacion-danger-value">
            {vencidas}
          </div>
        </div>
      </div>

      <div className="panel">
        {invoices.length === 0 ? (
          <p style={{ padding: 20 }}>
            No hay facturas para mostrar.
          </p>
        ) : (
          <table className="dt w-full">
            <thead>
              <tr>
                <th>N° Factura</th>
                <th>OC</th>
                <th>Cliente</th>
                <th>Emisión</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(/* Renderiza el contenido de cada elemento de invoices. */ (invoice) => (
                <tr key={invoice.id}>
                  <td className="facturacion-id-cell">
                    {invoice.id}
                  </td>
                  <td>{invoice.oc}</td>
                  <td className="facturacion-client-cell">
                    {invoice.cliente}
                  </td>
                  <td>{invoice.fecha}</td>
                  <td>{fmtCLP(invoice.subtotal)}</td>
                  <td>{fmtCLP(invoice.iva)}</td>
                  <td>
                    <Badge
                      t={
                        ["Pagada", "PAGADA"].includes(invoice.estado)
                          ? "ok"
                          : [
                                "Anulada",
                                "ANULADA",
                                "Vencida",
                                "VENCIDA",
                              ].includes(invoice.estado)
                            ? "danger"
                            : "warn"
                      }
                    >
                      {estadoLegible(invoice.estado)}
                    </Badge>
                  </td>
                  <td>
                    <div className="facturacion-action-group">
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Ver factura"
                        onClick={/* Ejecuta setPreview(invoice) al invocarse este callback. */ () => setPreview(invoice)}
                      >
                        <Ico p={I.pdf} size={13} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Enviar por correo"
                        onClick={/* Ejecuta sendInvoiceByMail(invoice) al invocarse este callback. */ () => sendInvoiceByMail(invoice)}
                      >
                        <Ico p={I.mail} size={13} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Imprimir o guardar como PDF"
                        onClick={/* Ejecuta downloadInvoicePdf(invoice) al invocarse este callback. */ () => downloadInvoicePdf(invoice)}
                      >
                        <Ico p={I.download} size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {preview && (
        <div
          className="modal-backdrop"
          onClick={/* Ejecuta setPreview(null) al invocarse este callback. */ () => setPreview(null)}
        >
          <div
            className="modal facturacion-modal"
            onClick={/* Ejecuta event.stopPropagation() al invocarse este callback. */ (event) => event.stopPropagation()}
          >
            <div className="facturacion-modal-header">
              <div>
                <h2 className="facturacion-modal-title">
                  Vista previa — {preview.id}
                </h2>
                <p className="facturacion-modal-subtitle">
                  Documento electrónico
                </p>
              </div>
              <button
                onClick={/* Ejecuta setPreview(null) al invocarse este callback. */ () => setPreview(null)}
                className="facturacion-icon-button"
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>

            <div className="facturacion-preview-card">
              <div className="facturacion-preview-header">
                <strong className="facturacion-preview-brand">
                  Ecoterra
                </strong>
                <strong>{preview.id}</strong>
              </div>
              <p className="facturacion-preview-client">
                {preview.cliente}
              </p>
              <p className="facturacion-preview-meta">
                OC {preview.oc} · Emisión {preview.fecha}
              </p>
              <div className="facturacion-preview-totals">
                <span>SUBTOTAL CLP</span>
                <span>{fmtCLP(preview.subtotal)}</span>
              </div>
              <div className="facturacion-preview-totals">
                <span>IVA (19%)</span>
                <span>{fmtCLP(preview.iva)}</span>
              </div>
              <div className="facturacion-preview-totals">
                <span>TOTAL CLP</span>
                <span>
                  {fmtCLP(
                    preview.total ??
                      preview.subtotal + preview.iva,
                  )}
                </span>
              </div>
              <div className="facturacion-preview-actions">
                <button
                  className="btn btn-primary"
                  onClick={/* Ejecuta sendInvoiceByMail(preview) al invocarse este callback. */ () => sendInvoiceByMail(preview)}
                >
                  <Ico p={I.mail} size={14} /> Enviar por correo
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={/* Ejecuta downloadInvoicePdf(preview) al invocarse este callback. */ () => downloadInvoicePdf(preview)}
                >
                  <Ico p={I.download} size={14} /> Imprimir / PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div
          className="modal-backdrop"
          onClick={closeNewInvoice}
        >
          <div
            className="modal facturacion-modal facturacion-modal-wide"
            onClick={/* Ejecuta event.stopPropagation() al invocarse este callback. */ (event) => event.stopPropagation()}
          >
            <div className="facturacion-modal-header">
              <div>
                <h2 className="facturacion-modal-title">
                  Nueva factura
                </h2>
                <p className="facturacion-modal-subtitle facturacion-modal-subtitle-spaced">
                  Selecciona una orden de compra y agrega sus productos.
                </p>
              </div>
              <button
                onClick={closeNewInvoice}
                className="facturacion-icon-button"
                disabled={guardando}
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>

            {errorCarga && (
              <p
                role="alert"
                style={{ color: "#dc2626", padding: "8px 0" }}
              >
                Error al cargar datos: {errorCarga}
              </p>
            )}

            {errorGuardado && (
              <p
                role="alert"
                style={{ color: "#dc2626", padding: "8px 0" }}
              >
                {errorGuardado}
              </p>
            )}

            {cargandoDatos ? (
              <p>Cargando productos y órdenes de compra...</p>
            ) : (
              <>
                <div className="facturacion-form-grid">
                  <div className="field">
                    <label className="label">
                      Orden de compra
                    </label>
                    <select
                      className="select"
                      value={ordenSeleccionada}
                      onChange={/* Cambia la orden elegida y borra el error de guardado. */ (event) => {
                        setOrdenSeleccionada(event.target.value)
                        setErrorGuardado("")
                      }}
                    >
                      <option value="">
                        Selecciona una orden
                      </option>
                      {ordenesCompra.map(/* Renderiza el contenido de cada elemento de ordenesCompra. */ (orden) => (
                        <option
                          key={String(orden.id_oc)}
                          value={String(orden.id_oc)}
                        >
                          {orden.numero_oc ||
                            `OC #${orden.id_oc}`}
                          {obtenerNombreCliente(orden)
                            ? ` — ${obtenerNombreCliente(orden)}`
                            : ""}
                        </option>
                      ))}
                    </select>
                    {ordenesCompra.length === 0 && (
                      <p className="facturacion-modal-subtitle">
                        No hay órdenes disponibles para esta sesión.
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label className="label">Cliente</label>
                    <input
                      className="input"
                      value={
                        nombreCliente ||
                        (clienteId ? `Cliente ${clienteId}` : "")
                      }
                      placeholder="Se obtiene de la orden"
                      readOnly
                    />
                  </div>
                </div>

                <div
                  className="field"
                  style={{ marginTop: 16 }}
                >
                  <label className="label">Productos</label>

                  {detalles.map(/* Renderiza el contenido de cada elemento de detalles. */ (detalle, index) => (
                    <div
                      key={index}
                      className="facturacion-form-grid"
                      style={{ marginBottom: 12 }}
                    >
                      <div className="field">
                        <label className="label">
                          Producto
                        </label>
                        <select
                          className="select"
                          value={detalle.producto_id}
                          onChange={/* Ejecuta setDetalles((actuales) => actuales.map((item, i) => i === index ? { ...item, producto_id: event.target.value, } : item, ), ) al invocarse este callback. */ (event) =>
                            setDetalles(/* Calcula el nuevo valor de Detalles devolviendo actuales.map((item, i) => i === index ? { ...item, producto_id: event.target.value, } : item, ). */ (actuales) =>
                              actuales.map(/* Transforma cada elemento de la lista devolviendo i === index ? { ...item, producto_id: event.target.value, } : item. */ (item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      producto_id:
                                        event.target.value,
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          <option value="">
                            Selecciona un producto
                          </option>
                          {productos.map(/* Renderiza el contenido de cada elemento de productos. */ (producto) => (
                            <option
                              key={producto.id}
                              value={producto.id}
                            >
                              {producto.codigo} — {producto.nombre}
                              {producto.unidad
                                ? ` (${producto.unidad})`
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="field">
                        <label className="label">
                          Cantidad
                        </label>
                        <input
                          className="input"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={detalle.cantidad}
                          onChange={/* Ejecuta setDetalles((actuales) => actuales.map((item, i) => i === index ? { ...item, cantidad: event.target.value, } : item, ), ) al invocarse este callback. */ (event) =>
                            setDetalles(/* Calcula el nuevo valor de Detalles devolviendo actuales.map((item, i) => i === index ? { ...item, cantidad: event.target.value, } : item, ). */ (actuales) =>
                              actuales.map(/* Transforma cada elemento de la lista devolviendo i === index ? { ...item, cantidad: event.target.value, } : item. */ (item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      cantidad:
                                        event.target.value,
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>

                      <div className="field">
                        <label className="label">
                          Precio unitario (CLP)
                        </label>
                        <input
                          className="input"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Ej. 15000"
                          value={detalle.precio_unitario}
                          onChange={/* Ejecuta setDetalles((actuales) => actuales.map((item, i) => i === index ? { ...item, precio_unitario: event.target.value, } : item, ), ) al invocarse este callback. */ (event) =>
                            setDetalles(/* Calcula el nuevo valor de Detalles devolviendo actuales.map((item, i) => i === index ? { ...item, precio_unitario: event.target.value, } : item, ). */ (actuales) =>
                              actuales.map(/* Transforma cada elemento de la lista devolviendo i === index ? { ...item, precio_unitario: event.target.value, } : item. */ (item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      precio_unitario:
                                        event.target.value,
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>

                      {detalles.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={/* Ejecuta setDetalles((actuales) => actuales.filter( (_, i) => i !== index, ), ) al invocarse este callback. */ () =>
                            setDetalles(/* Calcula el nuevo valor de Detalles devolviendo actuales.filter( (_, i) => i !== index, ). */ (actuales) =>
                              actuales.filter(
                                /* Comprueba qué elementos cumplen la condición evaluando i !== index. */ (_, i) => i !== index,
                              ),
                            )
                          }
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={/* Ejecuta setDetalles((actuales) => [ ...actuales, createDetalle(), ]) al invocarse este callback. */ () =>
                      setDetalles(/* Calcula el nuevo valor de Detalles devolviendo [ ...actuales, createDetalle(), ]. */ (actuales) => [
                        ...actuales,
                        createDetalle(),
                      ])
                    }
                  >
                    <Ico p={I.plus} size={14} /> Agregar producto
                  </button>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div className="facturacion-preview-totals">
                    <span>Subtotal estimado</span>
                    <span>{fmtCLP(subtotalCalculado)}</span>
                  </div>
                  <div className="facturacion-preview-totals">
                    <span>IVA estimado (19%)</span>
                    <span>{fmtCLP(ivaCalculado)}</span>
                  </div>
                  <div className="facturacion-preview-totals">
                    <strong>Total estimado</strong>
                    <strong>{fmtCLP(totalCalculado)}</strong>
                  </div>
                  <p className="facturacion-modal-subtitle">
                    El total definitivo lo calcula y guarda el backend.
                  </p>
                </div>
              </>
            )}

            <div className="facturacion-form-actions">
              <button
                className="btn btn-primary"
                onClick={guardarFactura}
                disabled={guardando || cargandoDatos}
              >
                <Ico p={I.check} size={14} />
                {guardando ? "Guardando..." : "Guardar factura"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={closeNewInvoice}
                disabled={guardando}
              >
                Cancelar
              </button>
              <div className="facturacion-form-footnote">
                {invoiceCount} facturas en pantalla
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
