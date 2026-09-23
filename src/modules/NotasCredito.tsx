import React, { useState } from "react"
import { Badge, fmtCLP, I, Ico, PageTitle } from "../shared"

type CreditNote = {
  id: string
  factura: string
  cliente: string
  fecha: string
  subtotal: number
  iva: number
  total: number
  motivo: string
  estado: string
}

export default function NotasCredito({
  facturas,
}: {
  facturas: { id: string; cliente: string; total: number }[]
}) {
  const [showNew, setShowNew] = useState(false)

  const notes: CreditNote[] = [
    {
      id: "NC-2024-003",
      factura: "FAC-2024-120",
      cliente: "Portuaria del Pacífico",
      fecha: "2024-06-15",
      subtotal: -487395,
      iva: -92595,
      total: -580000,
      motivo: "Devolución parcial — envase dañado",
      estado: "Emitida",
    },
    {
      id: "NC-2024-002",
      factura: "FAC-2024-118",
      cliente: "Agrícola Atacama SpA",
      fecha: "2024-05-10",
      subtotal: -120000,
      iva: -22800,
      total: -142800,
      motivo: "Ajuste de precio por volumen",
      estado: "Emitida",
    },
  ]

  const downloadCreditNotePdf = (note: CreditNote) => {
    const printWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=900,height=700",
    )
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Nota de Crédito ${note.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
            .card { border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #dc2626; padding-bottom: 14px; margin-bottom: 18px; }
            .brand { color: #dc2626; font-size: 20px; font-weight: 700; }
            .meta { color: #64748b; font-size: 12px; margin-top: 6px; }
            .totals { margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 14px; display: flex; justify-content: space-between; font-weight: 700; }
            .muted { color: #64748b; }
            .motivo { background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 16px; font-size: 13px; color: #475569; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <div class="brand">Ecoterra</div>
                <div class="meta">Nota de Crédito Electrónica</div>
              </div>
              <strong>${note.id}</strong>
            </div>
            <p><strong>${note.cliente}</strong></p>
            <p class="muted">Factura origen ${note.factura} · Emisión ${note.fecha}</p>
            <div class="motivo"><strong>Motivo:</strong> ${note.motivo}</div>
            <div class="totals">
              <span>SUBTOTAL</span>
              <span>${fmtCLP(note.subtotal)}</span>
            </div>
            <div class="totals" style="border-top: none; padding-top: 0; margin-top: 4px;">
              <span>IVA (19%)</span>
              <span>${fmtCLP(note.iva)}</span>
            </div>
            <div class="totals" style="border-top: 2px solid #dc2626; padding-top: 10px; margin-top: 10px;">
              <span>TOTAL</span>
              <span>${fmtCLP(note.total)}</span>
            </div>
            <div class="totals" style="border-top: none; padding-top: 4px; margin-top: 0; font-weight: 400; color: #64748b; font-size: 12px;">
              <span>Estado</span>
              <span>${note.estado}</span>
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
        title="Notas de Crédito"
        sub="Documentos asociados a facturas emitidas"
      >
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Ico p={I.plus} size={14} /> Nueva NC
        </button>
      </PageTitle>
      <div className="panel">
        <table className="dt w-full">
          <thead>
            <tr>
              <th>N° NC</th>
              <th>Factura Origen</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td className="nc-id">{note.id}</td>
                <td className="nc-factura">{note.factura}</td>
                <td className="nc-cliente">{note.cliente}</td>
                <td>{note.fecha}</td>
                <td>{fmtCLP(note.subtotal)}</td>
                <td>{fmtCLP(note.iva)}</td>
                <td className="nc-monto">{fmtCLP(note.total)}</td>
                <td>{note.motivo}</td>
                <td>
                  <Badge t="ok">{note.estado}</Badge>
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    title="Ver PDF"
                    onClick={() => downloadCreditNotePdf(note)}
                  >
                    <Ico p={I.pdf} size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div
            className="modal nc-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="nc-modal-header">
              <h2 className="nc-modal-title">
                Nueva Nota de Crédito
              </h2>
              <button onClick={() => setShowNew(false)} className="nc-modal-close">
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="nc-form-stack">
              <div className="field">
                <label className="label">Factura de Origen *</label>
                <select className="select">
                  <option>Seleccionar factura…</option>
                  {facturas.map((invoice) => (
                    <option key={invoice.id}>
                      {invoice.id} · {invoice.cliente} · {fmtCLP(invoice.total)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">Fecha</label>
                <input
                  className="input"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className="field">
                <label className="label">Subtotal NC (CLP)</label>
                <input className="input" type="number" placeholder="0" />
              </div>
              <div className="field">
                <label className="label">IVA NC (19%)</label>
                <input className="input" readOnly value="$0" />
              </div>
              <div className="field">
                <label className="label">Total NC (CLP)</label>
                <input className="input" readOnly value="$0" />
              </div>
              <div className="field">
                <label className="label">Motivo *</label>
                <select className="select">
                  <option>Devolución parcial de mercancía</option>
                  <option>Ajuste de precio por volumen</option>
                  <option>Error en facturación</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Estado *</label>
                <select className="select">
                  <option>Emitida</option>
                  <option>Anulada</option>
                  <option>Pendiente</option>
                </select>
              </div>
            </div>
            <div className="nc-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowNew(false)}
              >
                <Ico p={I.check} size={14} /> Emitir NC
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowNew(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}