import React, { useEffect, useState } from "react"
import { Badge, fmtCLP, I, Ico, PageTitle } from "../shared"

type Invoice = {
  id: string
  oc: string
  cliente: string
  fecha: string
  subtotal: number
  iva: number
  estado: string
}

type InvoiceForm = {
  oc: string
  cliente: string
  fecha: string
  subtotal: string
  estado: string
}

const createInvoiceForm = (): InvoiceForm => ({
  oc: "",
  cliente: "",
  fecha: new Date().toISOString().slice(0, 10),
  subtotal: "",
  estado: "Pendiente",
})

export default function Facturacion({ facturas }: { facturas: Invoice[] }) {
  const [invoices, setInvoices] = useState(facturas)
  const [preview, setPreview] = useState<Invoice | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState<InvoiceForm>(createInvoiceForm())

  useEffect(() => {
    setInvoices(facturas)
  }, [facturas])

  const totalFacturado = invoices.reduce((sum, invoice) => sum + invoice.subtotal + invoice.iva, 0)
  const pagadas = invoices.filter((invoice) => invoice.estado === "Pagada").length
  const pendientes = invoices.filter((invoice) => invoice.estado === "Pendiente").length
  const vencidas = invoices.filter((invoice) => invoice.estado === "Vencida").length
  const invoiceCount = invoices.length

  const openNewInvoice = () => {
    setForm(createInvoiceForm())
    setShowNew(true)
  }

  const closeNewInvoice = () => {
    setShowNew(false)
  }

  const getNextInvoiceNumber = () =>
    Math.max(...invoices.map((invoice) => Number(invoice.id.replace(/\D/g, ""))), 0) + 1

  const calculateIva = (subtotal: number) => Math.round(subtotal * 0.19)

  const saveInvoice = () => {
    if (!form.oc || !form.cliente || !form.subtotal) return

    const subtotal = Number(form.subtotal)
    const iva = calculateIva(subtotal)
    const nextInvoice: Invoice = {
      id: `F-${String(getNextInvoiceNumber()).padStart(5, "0")}`,
      oc: form.oc,
      cliente: form.cliente,
      fecha: form.fecha,
      subtotal,
      iva,
      estado: form.estado,
    }

    setInvoices((current) => [nextInvoice, ...current])
    setPreview(nextInvoice)
    closeNewInvoice()
  }

  const sendInvoiceByMail = (invoice: Invoice) => {
    const subject = encodeURIComponent(`Factura ${invoice.id} · Ecoterra`)
    const body = encodeURIComponent(
      `Estimado cliente, adjuntamos la factura ${invoice.id} por ${fmtCLP(invoice.subtotal + invoice.iva)}.`,
    )

    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const downloadInvoicePdf = (invoice: Invoice) => {
    const printWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=900,height=700",
    )
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Factura ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
            .card { border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #00995a; padding-bottom: 14px; margin-bottom: 18px; }
            .brand { color: #00995a; font-size: 20px; font-weight: 700; }
            .meta { color: #64748b; font-size: 12px; margin-top: 6px; }
            .totals { margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 14px; display: flex; justify-content: space-between; font-weight: 700; }
            .muted { color: #64748b; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <div class="brand">Ecoterra</div>
                <div class="meta">Documento electrónico</div>
              </div>
              <strong>${invoice.id}</strong>
            </div>
            <p><strong>${invoice.cliente}</strong></p>
            <p class="muted">OC ${invoice.oc} · Emisión ${invoice.fecha}</p>
            <div class="totals">
              <span>SUBTOTAL CLP</span>
              <span>${fmtCLP(invoice.subtotal)}</span>
            </div>
            <div class="totals" style="border-top: none; padding-top: 0; margin-top: 4px;">
              <span>IVA (19%)</span>
              <span>${fmtCLP(invoice.iva)}</span>
            </div>
          </div>
          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div>
      <PageTitle
        title="Facturación"
        sub="Documentos tributarios electrónicos 1:1 con OC"
      >
        <button className="btn btn-primary" onClick={openNewInvoice}>
          <Ico p={I.plus} size={14} /> Nueva factura
        </button>
      </PageTitle>
      <div className="facturacion-kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Total facturado (mes)</div>
          <div className="kpi-value tabular">{fmtCLP(totalFacturado)}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Pagadas</div>
          <div className="kpi-value tabular">{pagadas}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value tabular facturacion-warning-value">{pendientes}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Vencidas</div>
          <div className="kpi-value tabular facturacion-danger-value">{vencidas}</div>
        </div>
      </div>
      <div className="panel">
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
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="facturacion-id-cell">{invoice.id}</td>
                <td>{invoice.oc}</td>
                <td className="facturacion-client-cell">{invoice.cliente}</td>
                <td>{invoice.fecha}</td>
                <td>{fmtCLP(invoice.subtotal)}</td>
                <td>{fmtCLP(invoice.iva)}</td>
                <td>
                  <Badge
                    t={
                      invoice.estado === "Pagada"
                        ? "ok"
                        : invoice.estado === "Vencida"
                          ? "danger"
                          : "warn"
                    }
                  >
                    {invoice.estado}
                  </Badge>
                </td>
                <td>
                  <div className="facturacion-action-group">
                    <button
                      className="btn btn-ghost btn-sm"
                      title="Ver factura"
                      onClick={() => setPreview(invoice)}
                    >
                      <Ico p={I.pdf} size={13} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      title="Enviar PDF por correo"
                      onClick={() => sendInvoiceByMail(invoice)}
                    >
                      <Ico p={I.mail} size={13} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      title="Descargar en PDF"
                      onClick={() => downloadInvoicePdf(invoice)}
                    >
                      <Ico p={I.download} size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div
            className="modal facturacion-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="facturacion-modal-header">
              <div>
                <h2 className="facturacion-modal-title">
                  Vista Previa — {preview.id}
                </h2>
                <p className="facturacion-modal-subtitle">
                  Documento electrónico · No editable
                </p>
              </div>
              <button onClick={() => setPreview(null)} className="facturacion-icon-button">
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="facturacion-preview-card">
              <div className="facturacion-preview-header">
                <strong className="facturacion-preview-brand">Ecoterra</strong>
                <strong>{preview.id}</strong>
              </div>
              <p className="facturacion-preview-client">{preview.cliente}</p>
              <p className="facturacion-preview-meta">
                OC {preview.oc} · Emisión {preview.fecha}
              </p>
              <div className="facturacion-preview-totals">
                <span>SUBTOTAL CLP</span>
                <span>{fmtCLP(preview.subtotal)}</span>
              </div>
              <div className="facturacion-preview-totals" style={{ borderTop: 'none', paddingTop: 0, marginTop: 4 }}>
                <span>IVA (19%)</span>
                <span>{fmtCLP(preview.iva)}</span>
              </div>
              <div className="facturacion-preview-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => sendInvoiceByMail(preview)}
                >
                  <Ico p={I.mail} size={14} /> Enviar PDF al correo
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => downloadInvoicePdf(preview)}
                >
                  <Ico p={I.download} size={14} /> Descargar en PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showNew && (
        <div className="modal-backdrop" onClick={closeNewInvoice}>
          <div
            className="modal facturacion-modal facturacion-modal-wide"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="facturacion-modal-header">
              <div>
                <h2 className="facturacion-modal-title">
                  Nueva factura
                </h2>
                <p className="facturacion-modal-subtitle facturacion-modal-subtitle-spaced">
                  Completa los datos para crear una factura y abrir su vista previa.
                </p>
              </div>
              <button onClick={closeNewInvoice} className="facturacion-icon-button">
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="facturacion-form-grid">
              <div className="field">
                <label className="label">OC</label>
                <input
                  className="input"
                  placeholder="OC-2024-001"
                  value={form.oc}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, oc: event.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Cliente</label>
                <input
                  className="input"
                  placeholder="Razón social"
                  value={form.cliente}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      cliente: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Fecha de emisión</label>
                <input
                  className="input"
                  type="date"
                  value={form.fecha}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, fecha: event.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Subtotal</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.subtotal}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subtotal: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Estado</label>
                <select
                  className="select"
                  value={form.estado}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, estado: event.target.value }))
                  }
                >
                  <option>Pendiente</option>
                  <option>Pagada</option>
                  <option>Vencida</option>
                </select>
              </div>
              <div className="field">
                <label className="label">IVA calculado</label>
                <input
                  className="input"
                  value={
                    form.subtotal
                      ? fmtCLP(Math.round(Number(form.subtotal) * 0.19))
                      : "$0"
                  }
                  readOnly
                />
              </div>
            </div>
            <div className="facturacion-form-actions">
              <button className="btn btn-primary" onClick={saveInvoice}>
                <Ico p={I.check} size={14} /> Guardar factura
              </button>
              <button className="btn btn-ghost" onClick={closeNewInvoice}>
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