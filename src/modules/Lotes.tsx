import React, { useState } from "react"

import { Badge, fmt, I, Ico, PageTitle } from "../shared"

type Lot = {
  id: string
  prod: string
  batch: string
  qty: number
  envase: string
  fabr: string
  venc: string
  ubic: string
  estado: string
}

export default function Lotes({ lotes }: { lotes: Lot[] }) {
  const [envase, setEnvase] = useState("")
  const [estado, setEstado] = useState("")

  const filtered = lotes.filter(
    (lot) =>
      (!envase || lot.envase === envase) && (!estado || lot.estado === estado),
  )

  const expiringSoon = (date: string) => {
    const ms = new Date(date).getTime() - Date.now()
    return ms > 0 && ms < 1000 * 60 * 60 * 24 * 180
  }

  return (
    <div>
      <PageTitle
        title="Control de Lotes"
        sub="Trazabilidad de inventario físico por lote"
      >
        <button className="btn btn-primary">
          <Ico p={I.plus} size={14} /> Registrar lote
        </button>
      </PageTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div className="kpi">
          <div className="kpi-label">Lotes activos</div>
          <div className="kpi-value tabular">
            {lotes.filter((lot) => lot.qty > 0).length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Litros en bodega</div>
          <div className="kpi-value tabular">
            {fmt(lotes.reduce((sum, lot) => sum + lot.qty, 0))} L
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Sin stock</div>
          <div className="kpi-value tabular" style={{ color: "#DC2626" }}>
            {lotes.filter((lot) => lot.qty === 0).length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Próx. a vencer</div>
          <div className="kpi-value tabular" style={{ color: "#B45309" }}>
            {lotes.filter((lot) => expiringSoon(lot.venc)).length}
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: "flex", gap: 8 }}>
            <select
              className="select"
              style={{ width: 180 }}
              value={envase}
              onChange={(event) => setEnvase(event.target.value)}
            >
              <option value="">Todos los envases</option>
              <option>Tambo 200 L</option>
              <option>IBC 1000 L</option>
            </select>
            <select
              className="select"
              style={{ width: 160 }}
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
            >
              <option value="">Todos los estados</option>
              <option>Disponible</option>
              <option>Reservado</option>
            </select>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
            {filtered.length} lotes
          </span>
        </div>
        <table className="dt w-full">
          <thead>
            <tr>
              <th>ID Lote</th>
              <th>Batch</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Envase</th>
              <th>Fabricación</th>
              <th>Vencimiento</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lot) => (
              <tr key={lot.id}>
                <td
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontWeight: 700,
                    color: "#0052CC",
                  }}
                >
                  {lot.id}
                </td>
                <td>{lot.batch}</td>
                <td style={{ fontWeight: 600 }}>{lot.prod}</td>
                <td
                  style={{
                    fontWeight: 700,
                    color: lot.qty === 0 ? "#DC2626" : "#0F172A",
                  }}
                >
                  {fmt(lot.qty)} L
                </td>
                <td>
                  <Badge t="neutral">{lot.envase}</Badge>
                </td>
                <td>{lot.fabr}</td>
                <td
                  style={{
                    color: expiringSoon(lot.venc) ? "#B45309" : "#475569",
                    fontWeight: expiringSoon(lot.venc) ? 700 : 400,
                  }}
                >
                  {expiringSoon(lot.venc) && "⚠ "}
                  {lot.venc}
                </td>
                <td>
                  <code>{lot.ubic}</code>
                </td>
                <td>
                  <Badge t={lot.estado === "Disponible" ? "ok" : "warn"}>
                    {lot.estado}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
