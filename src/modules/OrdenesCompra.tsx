import React, { useRef, useState } from "react"
import { fmtCLP, I, Ico, PageTitle } from "../shared"

type PurchaseOrder = {
  id: string
  cot: string
  cliente: string
  fecha: string
  total: number
  factura: string | null
}

type Invoice = {
  id: string
  oc: string
  cliente: string
  fecha: string
  venc: string
  subtotal: number
  iva: number
  total: number
  estado: string
}

export default function OrdenesCompra({
  ordenes,
  facturas,
}: {
  ordenes: PurchaseOrder[]
  facturas: Invoice[]
}) {
  const [orders, setOrders] = useState(ordenes)
  const [generatedInvoices, setGeneratedInvoices] = useState<Invoice[]>([])
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("")
  const [detectedOrder, setDetectedOrder] = useState({
    id: "",
    cot: "",
    cliente: "",
    fecha: "",
    total: "",
    factura: "",
  })

  const allInvoices = [...facturas, ...generatedInvoices]
  const getInvoice = (order: PurchaseOrder) =>
    allInvoices.find(
      (invoice) => invoice.oc === order.id || invoice.id === order.factura,
    )

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedPdf(file)
    setPdfPreviewUrl(URL.createObjectURL(file))
    setDetectedOrder({
      id: "OC-2024-042",
      cot: "COT-2024-041",
      cliente: "Minera Los Bronces S.A.",
      fecha: new Date().toISOString().slice(0, 10),
      total: "4250000",
      factura: "",
    })
    setShowUploadModal(true)
    event.target.value = ""
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
    setUploadedPdf(null)
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl)
    setPdfPreviewUrl("")
  }

  const saveUploadedOrder = () => {
    if (!uploadedPdf || !detectedOrder.id || !detectedOrder.cliente) return

    setOrders((current) => [
      {
        id: detectedOrder.id,
        cot: detectedOrder.cot,
        cliente: detectedOrder.cliente,
        fecha: detectedOrder.fecha,
        total: Number(detectedOrder.total) || 0,
        factura: detectedOrder.factura || null,
      },
      ...current.filter((order) => order.id !== detectedOrder.id),
    ])
    closeUploadModal()
  }

  const generateInvoice = () => {
    const order = orders.find((item) => item.id === selectedOrderId)
    if (!order || getInvoice(order)) return

    const subtotal = Math.round(order.total / 1.19)
    const invoiceNumber =
      Math.max(
        ...allInvoices.map((invoice) =>
          Number(invoice.id.replace("FAC-2024-", "")),
        ),
        0,
      ) + 1
    const issueDate = new Date()
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + 30)
    const formatDate = (date: Date) => date.toISOString().slice(0, 10)

    setGeneratedInvoices((current) => [
      ...current,
      {
        id: `FAC-2024-${String(invoiceNumber).padStart(3, "0")}`,
        oc: order.id,
        cliente: order.cliente,
        fecha: formatDate(issueDate),
        venc: formatDate(dueDate),
        subtotal,
        iva: order.total - subtotal,
        total: order.total,
        estado: "Pendiente",
      },
    ])
    setShowInvoiceModal(false)
    setSelectedOrderId("")
  }

  return (
    <div>
      <PageTitle
        title="Órdenes de Compra"
        sub="OC recibidas de clientes y trazabilidad documental"
      >
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => pdfInputRef.current?.click()}
        >
          <Ico p={I.upload} size={14} /> Subir OC en PDF
        </button>
        <input
          id="purchase-order-pdf"
          ref={pdfInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handlePdfUpload}
          style={{ display: "none" }}
        />
        <button
          className="btn btn-primary"
          onClick={() => setShowInvoiceModal(true)}
        >
          <Ico p={I.invoice} size={14} /> Generar factura
        </button>
      </PageTitle>
      <div className="panel">
        <table className="dt w-full">
          <thead>
            <tr>
              <th>N° OC</th>
              <th>Cotización</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Factura</th>
              <th>Archivo OC</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 700, color: "#0052CC" }}>
                  {order.id}
                </td>
                <td>{order.cot}</td>
                <td>{order.cliente}</td>
                <td>{order.fecha}</td>
                <td>
                  {getInvoice(order)?.id ?? order.factura ?? "—"}
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">
                    <Ico p={I.pdf} size={13} /> Vista previa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showInvoiceModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowInvoiceModal(false)}
        >
          <div
            className="modal"
            style={{ width: 520, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div>
                <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
                  Generar factura
                </h2>
                <p style={{ fontSize: "0.75rem", color: "#64748B" }}>
                  Selecciona una orden de compra sin factura.
                </p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                aria-label="Cerrar generación de factura"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="field">
              <label className="label">Orden de Compra *</label>
              <select
                className="select"
                value={selectedOrderId}
                onChange={(event) => setSelectedOrderId(event.target.value)}
              >
                <option value="">Seleccionar OC…</option>
                {orders
                  .filter((order) => !getInvoice(order))
                  .map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.id} · {order.cliente} · {fmtCLP(order.total)}
                    </option>
                  ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                className="btn btn-primary"
                disabled={!selectedOrderId}
                onClick={generateInvoice}
              >
                <Ico p={I.check} size={14} /> Emitir factura
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowInvoiceModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={closeUploadModal}>
          <div
            className="modal"
            style={{ width: 960, maxWidth: "calc(100vw - 32px)", padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h2 style={{ fontWeight: 700, color: "#0F172A" }}>Importar Orden de Compra</h2>
                <p style={{ fontSize: "0.75rem", color: "#64748B" }}>
                  Datos detectados automáticamente. Revisa y edita antes de guardar.
                </p>
              </div>
              <button onClick={closeUploadModal} aria-label="Cerrar importación" style={{ background: "none", border: "none", cursor: "pointer" }}>
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ minHeight: 500, border: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0", fontWeight: 700 }}>
                  Vista previa del PDF
                </div>
                {pdfPreviewUrl ? (
                  <iframe title="Vista previa de la orden de compra" src={pdfPreviewUrl} style={{ width: "100%", flex: 1, minHeight: 450, border: 0 }} />
                ) : (
                  <div style={{ display: "grid", placeItems: "center", flex: 1, color: "#64748B" }}>Sin archivo seleccionado</div>
                )}
                <div style={{ padding: 10, fontSize: "0.75rem", color: "#64748B", borderTop: "1px solid #E2E8F0" }}>
                  {uploadedPdf?.name}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="field">
                    <label className="label">N° Orden de Compra *</label>
                    <input className="input" value={detectedOrder.id} onChange={(event) => setDetectedOrder({ ...detectedOrder, id: event.target.value })} />
                  </div>
                  <div className="field">
                    <label className="label">Cotización</label>
                    <input className="input" value={detectedOrder.cot} onChange={(event) => setDetectedOrder({ ...detectedOrder, cot: event.target.value })} />
                  </div>
                  <div className="field">
                    <label className="label">Cliente *</label>
                    <input className="input" value={detectedOrder.cliente} onChange={(event) => setDetectedOrder({ ...detectedOrder, cliente: event.target.value })} />
                  </div>
                  <div className="field">
                    <label className="label">Fecha</label>
                    <input className="input" type="date" value={detectedOrder.fecha} onChange={(event) => setDetectedOrder({ ...detectedOrder, fecha: event.target.value })} />
                  </div>
                  <div className="field">
                    <label className="label">Total detectado (CLP)</label>
                    <input className="input" type="number" min={0} value={detectedOrder.total} onChange={(event) => setDetectedOrder({ ...detectedOrder, total: event.target.value })} />
                  </div>
                  <div className="field">
                    <label className="label">Factura asociada</label>
                    <select className="select" value={detectedOrder.factura} onChange={(event) => setDetectedOrder({ ...detectedOrder, factura: event.target.value })}>
                      <option value="">Sin factura asociada</option>
                      {allInvoices.map((invoice) => (
                        <option key={invoice.id} value={invoice.id}>{invoice.id} · {invoice.cliente} · {fmtCLP(invoice.total)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  <button className="btn btn-primary" disabled={!detectedOrder.id || !detectedOrder.cliente} onClick={saveUploadedOrder}>
                    <Ico p={I.check} size={14} /> Guardar orden
                  </button>
                  <button className="btn btn-ghost" onClick={closeUploadModal}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
