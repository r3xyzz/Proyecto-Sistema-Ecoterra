import React, { useState } from "react"
import { Badge, fmtCLP, I, Ico, PageTitle } from "../shared"

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

export default function Cotizaciones({
  cotizaciones,
  ordenes,
  facturas,
}: {
  cotizaciones: Quote[]
  ordenes: PurchaseOrder[]
  facturas: Invoice[]
}) {
  const [show, setShow] = useState(false)
  const [quotes, setQuotes] = useState(cotizaciones)
  const [preview, setPreview] = useState<Quote | null>(null)
  const [quoteToLink, setQuoteToLink] = useState<Quote | null>(null)
  const [selectedOrder, setSelectedOrder] = useState("")
  const [linkedOrders, setLinkedOrders] = useState<Record<string, string>>({})

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

  return (
    <div>
      <PageTitle title="Cotizaciones" sub="Ciclo de vida comercial">
        <button className="btn btn-primary" onClick={() => setShow(true)}>
          <Ico p={I.plus} size={14} /> Nueva cotización
        </button>
      </PageTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div className="kpi">
          <div className="kpi-label">Vigentes</div>
          <div className="kpi-value tabular">{activeQuotes.length}</div>
          <div style={{ color: "#64748B", fontSize: "0.75rem", marginTop: 4 }}>
            {fmtCLP(activeQuotes.reduce((sum, quote) => sum + quote.total, 0))} CLP
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Convertidas (mes)</div>
          <div className="kpi-value tabular" style={{ color: "#00995A" }}>
            {convertedQuotes.length}
          </div>
          <div style={{ color: "#64748B", fontSize: "0.75rem", marginTop: 4 }}>
            Tasa: {quotes.length ? Math.round((convertedQuotes.length / quotes.length) * 100) : 0}%
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Vencidas</div>
          <div className="kpi-value tabular" style={{ color: "#DC2626" }}>
            {expiredQuotes.length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Valor total</div>
          <div className="kpi-value tabular">
            {fmtCLP(totalQuoted)}
          </div>
          <div style={{ color: "#64748B", fontSize: "0.75rem", marginTop: 4 }}>
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
                <td style={{ fontWeight: 700, color: "#0052CC" }}>
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
                  <div style={{ display: "flex", gap: 4 }}>
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
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div
            className="modal"
            style={{ width: 480, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 style={{ fontWeight: 700, marginBottom: 18 }}>
              Nueva Cotización
            </h2>
            <div className="field">
              <label className="label">Cliente</label>
              <select className="select">
                <option>Seleccionar cliente…</option>
              </select>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label className="label">Vigencia</label>
              <select className="select">
                <option>7 días</option>
                <option>10 días</option>
                <option>15 días</option>
                <option>30 días</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                className="btn btn-primary"
                onClick={() => setShow(false)}
              >
                Guardar borrador
              </button>
              <button className="btn btn-ghost" onClick={() => setShow(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div
            className="modal"
            style={{ width: 680, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
                  Vista Previa · {preview.id}
                </h2>
                <p style={{ fontSize: "0.75rem", color: "#64748B" }}>
                  Cotización comercial · {preview.fecha}
                </p>
              </div>
              <button
                onClick={() => setPreview(null)}
                aria-label="Cerrar vista previa"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div style={{ border: "1px solid #E2E8F0", padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #00995A", paddingBottom: 16, marginBottom: 20 }}>
                <strong style={{ color: "#00995A", fontSize: "1.2rem" }}>Ecoterra</strong>
                <strong>{preview.id}</strong>
              </div>
              <p style={{ fontWeight: 700 }}>{preview.cliente}</p>
              <p style={{ color: "#64748B", marginTop: 6 }}>Vigencia hasta {preview.vigencia}</p>
              <p style={{ color: "#475569", marginTop: 18 }}>{preview.observacion}</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginTop: 28, borderTop: "1px solid #E2E8F0", paddingTop: 14 }}>
                <span>Subtotal: {fmtCLP(preview.subtotal)}</span>
                <span>IVA: {fmtCLP(preview.iva)}</span>
                <strong style={{ fontSize: "1rem" }}>Total: {fmtCLP(preview.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
      {quoteToLink && (
        <div className="modal-backdrop" onClick={() => setQuoteToLink(null)}>
          <div
            className="modal"
            style={{ width: 520, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Asociar Orden de Compra</h2>
            <p style={{ color: "#64748B", fontSize: "0.8125rem", marginBottom: 18 }}>
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
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
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
