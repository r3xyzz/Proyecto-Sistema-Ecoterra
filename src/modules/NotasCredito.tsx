import React, { useState } from "react"

import { Badge, fmtCLP, I, Ico, PageTitle } from "../shared"

type CreditNote = {
  id: string
  factura: string
  cliente: string
  fecha: string
  monto: number
  motivo: string
}

export default function NotasCredito({
  facturas,
}: {
  facturas: { id: string cliente: string total: number }[]
}) {
  const [showNew, setShowNew] = useState(false)

  const notes: CreditNote[] = [
    {
      id: "NC-2024-003",
      factura: "FAC-2024-120",
      cliente: "Portuaria del Pacífico",
      fecha: "2024-06-15",
      monto: -580000,
      motivo: "Devolución parcial — envase dañado",
    },
    {
      id: "NC-2024-002",
      factura: "FAC-2024-118",
      cliente: "Agrícola Atacama SpA",
      fecha: "2024-05-10",
      monto: -142800,
      motivo: "Ajuste de precio por volumen",
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
              <th>Monto (CLP)</th>
              <th>Motivo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td style={{ fontWeight: 700, color: "#DC2626" }}>{note.id}</td>
                <td style={{ color: "#0052CC" }}>{note.factura}</td>
                <td style={{ fontWeight: 600 }}>{note.cliente}</td>
                <td>{note.fecha}</td>
                <td style={{ fontWeight: 700, color: "#DC2626" }}>
                  {fmtCLP(note.monto)}
                </td>
                <td>{note.motivo}</td>
                <td>
                  <button className="btn btn-ghost btn-sm">
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
              <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
                Nueva Nota de Crédito
              </h2>
              <button
                onClick={() => setShowNew(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                <label className="label">Monto NC (CLP)</label>
                <input className="input" type="number" placeholder="0" />
              </div>
              <div className="field">
                <label className="label">Motivo *</label>
                <select className="select">
                  <option>Devolución parcial de mercancía</option>
                  <option>Ajuste de precio por volumen</option>
                  <option>Error en facturación</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
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
