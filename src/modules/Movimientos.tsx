import React, { useState } from "react"

import { Badge, fmt, I, Ico, PageTitle, Product } from "../shared"

type Lot = { id: string; prod: string; ubic: string; qty: number }

type Movement = {
  id: string
  ts: string
  tipo: string
  prod: string
  qty: number
  batch: string
  user: string
  ref: string
}

export default function Movimientos({
  productos,
  lotes,
}: {
  productos: Product[]
  lotes: Lot[]
}) {
  const [type, setType] = useState<"Entrada" | "Salida" | "Ajuste">("Entrada")
  const [prod, setProd] = useState("")
  const [qty, setQty] = useState("")
  const [done, setDone] = useState(false)

  const history: Movement[] = [
    {
      id: "MOV-00314",
      ts: "2024-06-13 09:22",
      tipo: "Entrada",
      prod: "POL-001",
      qty: 1200,
      batch: "LT-2024-002",
      user: "Juan Rojas",
      ref: "EMB-2024-010",
    },
    {
      id: "MOV-00313",
      ts: "2024-06-12 14:35",
      tipo: "Salida",
      prod: "POL-002",
      qty: -320,
      batch: "LT-2024-003",
      user: "María López",
      ref: "OC-2024-040",
    },
  ]

  const colors: Record<string, string> = {
    Entrada: "#00995A",
    Salida: "#DC2626",
    Ajuste: "#D97706",
  }

  return (
    <div>
      <PageTitle
        title="Movimientos de Stock"
        sub="Registro de entradas, salidas y ajustes"
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16 }}
      >
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>
            Registrar Movimiento
          </div>
          {done ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Ico p={I.check} size={30} />
              <p style={{ fontWeight: 700, color: "#15803D" }}>
                Movimiento registrado
              </p>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setDone(false)
                  setProd("")
                  setQty("")
                }}
              >
                Nuevo registro
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                {(["Entrada", "Salida", "Ajuste"] as const).map((value) => (
                  <button
                    key={value}
                    style={{
                      flex: 1,
                      padding: 8,
                      border: "none",
                      background:
                        type === value ? colors[value] : "transparent",
                      color: type === value ? "white" : "#94A3B8",
                    }}
                    onClick={() => setType(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div className="field">
                  <label className="label">Producto *</label>
                  <select
                    className="select"
                    value={prod}
                    onChange={(event) => setProd(event.target.value)}
                  >
                    <option value="">Seleccionar…</option>
                    {productos.map((product) => (
                      <option key={product.id}>{product.codigo}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Lote</label>
                  <select className="select" disabled={!prod}>
                    <option>Seleccionar lote…</option>
                    {lotes
                      .filter((lot) => lot.prod === prod)
                      .map((lot) => (
                        <option key={lot.id}>
                          {lot.id} · {lot.ubic} · {fmt(lot.qty)} L
                        </option>
                      ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Cantidad (litros) *</label>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(event) => setQty(event.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  disabled={!prod || !qty}
                  onClick={() => setDone(true)}
                >
                  <Ico p={I.check} size={14} /> Confirmar {type}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="panel">
          <div className="panel-header">Historial de Movimientos</div>
          <table className="dt w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha / Hora</th>
                <th>Tipo</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Lote</th>
                <th>Referencia</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {history.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.id}</td>
                  <td>{movement.ts}</td>
                  <td>
                    <Badge
                      t={
                        movement.tipo === "Entrada"
                          ? "ok"
                          : movement.tipo === "Salida"
                            ? "danger"
                            : "warn"
                      }
                    >
                      {movement.tipo}
                    </Badge>
                  </td>
                  <td>{movement.prod}</td>
                  <td
                    style={{ color: movement.qty < 0 ? "#DC2626" : "#15803D" }}
                  >
                    {movement.qty > 0 ? "+" : ""}
                    {fmt(movement.qty)} L
                  </td>
                  <td>{movement.batch}</td>
                  <td>{movement.ref}</td>
                  <td>{movement.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
