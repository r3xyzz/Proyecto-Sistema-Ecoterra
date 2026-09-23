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
                  <button className="btn btn-ghost btn-sm" title="Ver PDF">
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