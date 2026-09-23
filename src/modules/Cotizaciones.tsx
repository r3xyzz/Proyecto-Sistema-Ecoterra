import React, { useState } from "react"
import { Badge, fmtCLP, I, Ico, PageTitle, Product } from "../shared"

type Quote = {
  id: string
  cliente: string
  fecha: string
  vigencia: string
  subtotal: number
  iva: number
  total: number
  observacion: string
  estado: string
}

type PurchaseOrder = {
  id: string
  cot: string
  cliente: string
  total: number
  estado: string
  factura: string | null
}

type Invoice = {
  id: string
  oc: string
}

type Client = {
  id: number
  razon: string
  ciudad: string
}

type QuoteLine = {
  productId: string
  quantity: string
  unitPrice: string
}

export default function Cotizaciones({
  cotizaciones,
  ordenes,
  facturas,
  clientes,
  productos,
}: {
  cotizaciones: Quote[]
  ordenes: PurchaseOrder[]
  facturas: Invoice[]
  clientes: Client[]
  productos: Product[]
}) {
  const [show, setShow] = useState(false)
  const [quotes, setQuotes] = useState(cotizaciones)
  const [preview, setPreview] = useState<Quote | null>(null)
  const [quoteToLink, setQuoteToLink] = useState<Quote | null>(null)
  const [selectedOrder, setSelectedOrder] = useState("")
  const [linkedOrders, setLinkedOrders] = useState<Record<string, string>>({})
  const [quoteClient, setQuoteClient] = useState("")
  const [quoteAddress, setQuoteAddress] = useState("")
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().slice(0, 10))
  const [quoteValidity, setQuoteValidity] = useState("30")
  const [paymentTerm, setPaymentTerm] = useState("30 días")
  const [currency, setCurrency] = useState("CLP")
  const [quoteStatus, setQuoteStatus] = useState("Borrador")
  const [quoteObservation, setQuoteObservation] = useState("")
  const [quoteLines, setQuoteLines] = useState<QuoteLine[]>([
    { productId: "", quantity: "", unitPrice: "" },
  ])

  const activeQuotes = quotes.filter((quote) => quote.estado === "Vigente")
  const convertedQuotes = quotes.filter(
    (quote) => quote.estado === "Convertida",
  )
  const expiredQuotes = quotes.filter((quote) => quote.estado === "Vencida")
  const totalQuoted = quotes.reduce((sum, quote) => sum + quote.total, 0)

  const getPurchaseOrder = (quote: Quote) =>
    ordenes.find(
      (order) =>
        order.cot === quote.id || linkedOrders[quote.id] === order.id,
    ) ?? null

  const getInvoice = (quote: Quote) => {
    const order = getPurchaseOrder(quote)
    return order
      ? (facturas.find((invoice) => invoice.oc === order.id) ?? null)
      : null
  }

  const linkOrder = () => {
    const order = ordenes.find((purchaseOrder) => purchaseOrder.id === selectedOrder)
    if (!quoteToLink || !order) return

    setLinkedOrders((current) => ({ ...current, [quoteToLink.id]: order.id }))
    setQuotes((current) =>
      current.map((quote) =>
        quote.id === quoteToLink.id
          ? { ...quote, estado: "Convertida" }
          : quote,
      ),
    )
    setQuoteToLink(null)
    setSelectedOrder("")
  }

  const sendByEmail = (quote: Quote) => {
    const subject = encodeURIComponent(`Cotización ${quote.id} · Ecoterra`)
    const body = encodeURIComponent(
      `Estimado cliente, adjuntamos la cotización ${quote.id} por ${fmtCLP(quote.total)}.`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const selectedClient = clientes.find(
    (client) => client.razon === quoteClient,
  )
  const lineSubtotal = quoteLines.reduce(
    (sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0),
    0,
  )
  const lineIva = Math.round(lineSubtotal * 0.19)
  const lineTotal = lineSubtotal + lineIva

  const resetQuoteForm = () => {
    setQuoteClient("")
    setQuoteAddress("")
    setQuoteDate(new Date().toISOString().slice(0, 10))
    setQuoteValidity("30")
    setPaymentTerm("30 días")
    setCurrency("CLP")
    setQuoteStatus("Borrador")
    setQuoteObservation("")
    setQuoteLines([{ productId: "", quantity: "", unitPrice: "" }])
  }

  const closeQuoteForm = () => {
    setShow(false)
    resetQuoteForm()
  }

  const saveQuote = (status = quoteStatus) => {
    if (!quoteClient || !quoteLines.some((line) => line.productId && line.quantity)) return

    const nextId =
      Math.max(
        ...quotes.map((quote) => Number(quote.id.replace("COT-2024-", ""))),
        0,
      ) + 1
    const expiration = new Date(quoteDate)
    expiration.setDate(expiration.getDate() + Number(quoteValidity))
    const expirationDate = expiration.toISOString().slice(0, 10)

    setQuotes((current) => [
      {
        id: `COT-2024-${String(nextId).padStart(3, "0")}`,
        cliente: quoteClient,
        fecha: quoteDate,
        vigencia: expirationDate,
        subtotal: lineSubtotal,
        iva: lineIva,
        total: lineTotal,
        observacion: quoteObservation,
        estado: status,
      },
      ...current,
    ])
    closeQuoteForm()
  }

  const updateLine = (index: number, changes: Partial<QuoteLine>) => {
    setQuoteLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...changes } : line,
      ),
    )
  }

  return (
    <div>
      <PageTitle title="Cotizaciones" sub="Ciclo de vida comercial">
        <button className="btn btn-primary" onClick={() => setShow(true)}>
          <Ico p={I.plus} size={14} /> Nueva cotización
        </button>
      </PageTitle>
      <div className="cotizaciones-kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Vigentes</div>
          <div className="kpi-value tabular">{activeQuotes.length}</div>
          <div className="cotizaciones-kpi-note">
            {fmtCLP(activeQuotes.reduce((sum, quote) => sum + quote.total, 0))} CLP
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Convertidas (mes)</div>
          <div className="kpi-value tabular cotizaciones-kpi-positive">
            {convertedQuotes.length}
          </div>
          <div className="cotizaciones-kpi-note">
            Tasa: {quotes.length ? Math.round((convertedQuotes.length / quotes.length) * 100) : 0}%
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Vencidas</div>
          <div className="kpi-value tabular cotizaciones-kpi-negative">
            {expiredQuotes.length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Valor total</div>
          <div className="kpi-value tabular">
            {fmtCLP(totalQuoted)}
          </div>
          <div className="cotizaciones-kpi-note">
            CLP mes actual
          </div>
        </div>
      </div>
      <div className="panel">
        <table className="dt w-full">
          <thead>
            <tr>
              <th>N° Cotización</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Vigencia</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total (CLP)</th>
              <th>OC</th>
              <th>Factura</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id}>
                {(() => {
                  const order = getPurchaseOrder(quote)
                  const invoice = getInvoice(quote)

                  return (
                    <>
                      <td className="cotizaciones-table-id">
                        {quote.id}
                      </td>
                      <td>{quote.cliente}</td>
                      <td>{quote.fecha}</td>
                      <td>{quote.vigencia}</td>
                      <td>{fmtCLP(quote.subtotal)}</td>
                      <td>{fmtCLP(quote.iva)}</td>
                      <td>{fmtCLP(quote.total)}</td>
                      <td>{order?.id ?? "—"}</td>
                      <td>{invoice?.id ?? "—"}</td>
                      <td>
                        <Badge
                          t={
                            quote.estado === "Convertida"
                              ? "ok"
                              : quote.estado === "Vencida"
                                ? "danger"
                                : "info"
                          }
                        >
                          {quote.estado}
                        </Badge>
                      </td>
                      <td>
                        <div className="cotizaciones-row-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Vista previa"
                            aria-label={`Vista previa ${quote.id}`}
                            onClick={() => setPreview(quote)}
                          >
                            <Ico p={I.pdf} size={13} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Descargar PDF"
                            aria-label={`Descargar PDF ${quote.id}`}
                            onClick={() => {
                              setPreview(quote)
                              window.setTimeout(() => window.print(), 0)
                            }}
                          >
                            <Ico p={I.download} size={13} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Enviar por correo"
                            aria-label={`Enviar ${quote.id} por correo`}
                            onClick={() => sendByEmail(quote)}
                          >
                            <Ico p={I.mail} size={13} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Asociar a orden de compra"
                            aria-label={`Asociar ${quote.id} a una orden de compra`}
                            onClick={() => setQuoteToLink(quote)}
                          >
                            <Ico p={I.link} size={13} />
                          </button>
                        </div>
                      </td>
                    </>
                  )
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="modal-backdrop" onClick={closeQuoteForm}>
          <div
            className="modal cotizaciones-modal cotizaciones-modal-wide"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cotizaciones-modal-head">
              <div>
                <h2 className="cotizaciones-modal-title">Nueva Cotización</h2>
                <p className="cotizaciones-modal-subtitle">
                  COT-2024-{String(Math.max(...quotes.map((quote) => Number(quote.id.replace("COT-2024-", ""))), 0) + 1).padStart(3, "0")} · {quoteStatus}
                </p>
              </div>
              <button
                onClick={closeQuoteForm}
                aria-label="Cerrar nueva cotización"
                className="cotizaciones-modal-close"
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="cotizaciones-grid-2">
              <div className="field">
                <label className="label">Cliente *</label>
                <select className="select" value={quoteClient} onChange={(event) => { setQuoteClient(event.target.value); setQuoteAddress("") }}>
                  <option value="">Seleccionar cliente…</option>
                  {clientes.map((client) => <option key={client.id}>{client.razon}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Dirección de despacho *</label>
                <select className="select" value={quoteAddress} onChange={(event) => setQuoteAddress(event.target.value)} disabled={!selectedClient}>
                  <option value="">Seleccionar dirección…</option>
                  {selectedClient && <option value={selectedClient.ciudad}>{selectedClient.ciudad} · Dirección principal</option>}
                </select>
              </div>
              <div className="field">
                <label className="label">Fecha</label>
                <input className="input" type="date" value={quoteDate} onChange={(event) => setQuoteDate(event.target.value)} />
              </div>
              <div className="field">
                <label className="label">Vigencia</label>
                <select className="select" value={quoteValidity} onChange={(event) => setQuoteValidity(event.target.value)}>
                  <option value="30">30 días</option>
                  <option value="15">15 días</option>
                  <option value="45">45 días</option>
                  <option value="60">60 días</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Condición de pago</label>
                <select className="select" value={paymentTerm} onChange={(event) => setPaymentTerm(event.target.value)}>
                  <option>30 días</option>
                  <option>60 días</option>
                  <option>Contado</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Moneda</label>
                <select className="select" value={currency} onChange={(event) => setCurrency(event.target.value)}>
                  <option>CLP</option>
                  <option>USD</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Estado *</label>
                <select className="select" value={quoteStatus} onChange={(event) => setQuoteStatus(event.target.value)}>
                  <option>Borrador</option>
                  <option>Vigente</option>
                  <option>Vencida</option>
                  <option>Convertida</option>
                </select>
              </div>
            </div>
            <div className="cotizaciones-lines">
              <div className="cotizaciones-lines-header">
                <strong>Productos / Servicios</strong>
                <button className="btn btn-ghost btn-sm" onClick={() => setQuoteLines((current) => [...current, { productId: "", quantity: "", unitPrice: "" }])}>
                  <Ico p={I.plus} size={13} /> Agregar línea
                </button>
              </div>
              <div className="cotizaciones-lines-grid cotizaciones-lines-grid-head">
                <span>Producto</span><span>Cant.</span><span>P. Unit. ({currency})</span><span>Subtotal</span><span />
              </div>
              {quoteLines.map((line, index) => {
                const product = productos.find((item) => String(item.id) === line.productId)
                const subtotal = Number(line.quantity || 0) * Number(line.unitPrice || 0)
                return (
                  <div key={index} className="cotizaciones-lines-grid">
                    <select className="select" value={line.productId} onChange={(event) => updateLine(index, { productId: event.target.value })}>
                      <option value="">Seleccionar producto…</option>
                      {productos.map((item) => <option key={item.id} value={item.id}>{item.codigo} · {item.nombre}</option>)}
                    </select>
                    <input className="input" type="number" min={1} placeholder="0" value={line.quantity} onChange={(event) => updateLine(index, { quantity: event.target.value })} />
                    <input className="input" type="number" min={0} placeholder="0" value={line.unitPrice} onChange={(event) => updateLine(index, { unitPrice: event.target.value })} />
                    <span className="cotizaciones-line-subtotal">{product ? fmtCLP(subtotal) : "$0"}</span>
                    <button className="btn btn-ghost btn-sm" title="Eliminar línea" aria-label="Eliminar línea" disabled={quoteLines.length === 1} onClick={() => setQuoteLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}>
                      <Ico p={I.trash} size={13} />
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="field cotizaciones-observation">
              <label className="label">Observaciones</label>
              <textarea className="input" rows={3} placeholder="Notas adicionales de la cotización" value={quoteObservation} onChange={(event) => setQuoteObservation(event.target.value)} />
            </div>
            <div className="cotizaciones-summary">
              <span>Subtotal neto <strong>{fmtCLP(lineSubtotal)}</strong></span>
              <span>IVA (19%) <strong>{fmtCLP(lineIva)}</strong></span>
              <strong className="cotizaciones-summary-total">Total <span className="cotizaciones-summary-total-value">{fmtCLP(lineTotal)}</span></strong>
            </div>
            <div className="cotizaciones-summary-actions">
              <button className="btn btn-primary" disabled={!quoteClient || !quoteAddress || !quoteLines.some((line) => line.productId && line.quantity)} onClick={() => saveQuote("Borrador")}>
                <Ico p={I.check} size={14} /> Guardar borrador
              </button>
              <button className="btn btn-ghost" onClick={() => window.print()}><Ico p={I.download} size={14} /> Exportar PDF</button>
              <button className="btn btn-ghost" onClick={() => { const subject = encodeURIComponent("Nueva cotización Ecoterra"); window.location.href = `mailto:?subject=${subject}` }}><Ico p={I.mail} size={14} /> Enviar por correo</button>
              <button className="btn btn-navy" disabled={!quoteClient || !quoteAddress || !quoteLines.some((line) => line.productId && line.quantity)} onClick={() => saveQuote("Vigente")}><Ico p={I.check} size={14} /> Emitir cotización</button>
            </div>
          </div>
        </div>
      )}
      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div
            className="modal cotizaciones-modal cotizaciones-preview-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cotizaciones-preview-head">
              <div>
                <h2 className="cotizaciones-preview-title">
                  Vista Previa · {preview.id}
                </h2>
                <p className="cotizaciones-preview-subtitle">
                  Cotización comercial · {preview.fecha}
                </p>
              </div>
              <button
                onClick={() => setPreview(null)}
                aria-label="Cerrar vista previa"
                className="cotizaciones-modal-close"
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="cotizaciones-preview-shell">
              <div className="cotizaciones-preview-brand">
                <strong className="cotizaciones-preview-brand-name">Ecoterra</strong>
                <strong>{preview.id}</strong>
              </div>
              <p className="cotizaciones-preview-customer">{preview.cliente}</p>
              <p className="cotizaciones-preview-meta">Vigencia hasta {preview.vigencia}</p>
              <p className="cotizaciones-preview-note">{preview.observacion}</p>
              <div className="cotizaciones-preview-summary">
                <span>Subtotal: {fmtCLP(preview.subtotal)}</span>
                <span>IVA: {fmtCLP(preview.iva)}</span>
                <strong className="cotizaciones-summary-total">Total: {fmtCLP(preview.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
      {quoteToLink && (
        <div className="modal-backdrop" onClick={() => setQuoteToLink(null)}>
          <div
            className="modal cotizaciones-modal cotizaciones-link-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="cotizaciones-link-title">Asociar Orden de Compra</h2>
            <p className="cotizaciones-link-subtitle">
              Selecciona una OC existente para {quoteToLink.id}.
            </p>
            <div className="field">
              <label className="label">Orden de Compra *</label>
              <select className="select" value={selectedOrder} onChange={(event) => setSelectedOrder(event.target.value)}>
                <option value="">Seleccionar OC…</option>
                {ordenes.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id} · {order.cliente} · {fmtCLP(order.total)}
                  </option>
                ))}
              </select>
            </div>
            <div className="cotizaciones-link-actions">
              <button className="btn btn-primary" disabled={!selectedOrder} onClick={linkOrder}>
                <Ico p={I.link} size={14} /> Asociar OC
              </button>
              <button className="btn btn-ghost" onClick={() => setQuoteToLink(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}