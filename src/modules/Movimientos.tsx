import React, { useState } from "react"
import { Badge, fmt, I, Ico, PageTitle, Product } from "../shared"
import { Lote } from "./Lotes"

export type Movimiento = {
  id: number
  ts: string
  tipo: string
  prod: string
  qty: number
  lote: string
  ref: string
  observacion: string
  user: string
}

export type MovimientoInput = {
  tipo: string
  id_inventario: number
  cantidad_movimiento: number
  referencia?: string
  observacion?: string
  id_usuario: number
}

type Props = {
  productos: Product[]
  lotes: Lote[]
  movimientos: Movimiento[]
  usuarioId: number
  loadError?: string
  onCreate: (input: MovimientoInput) => Promise<Movimiento>
}

export default function Movimientos({
  productos,
  lotes,
  movimientos,
  usuarioId,
  loadError,
  onCreate,
}: Props) {
  const [type, setType] = useState<"Entrada" | "Salida" | "Ajuste">("Entrada")
  const [prod, setProd] = useState("")
  const [loteId, setLoteId] = useState("")
  const [qty, setQty] = useState("")
  const [reference, setReference] = useState("")
  const [observation, setObservation] = useState("")
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const colors: Record<string, string> = {
    Entrada: "#00995A",
    Salida: "#DC2626",
    Ajuste: "#D97706",
  }

  const lotesDelProducto = lotes.filter((l) => l.prod === prod)

  const registerMovement = async () => {
    if (!prod || !loteId || !qty) {
      setError("Producto, lote y cantidad son obligatorios.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await onCreate({
        tipo: type,
        id_inventario: Number(loteId),
        cantidad_movimiento: Number(qty),
        referencia: reference || undefined,
        observacion: observation || undefined,
        id_usuario: usuarioId,
      })
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al registrar movimiento")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setDone(false)
    setProd("")
    setLoteId("")
    setQty("")
    setReference("")
    setObservation("")
    setError("")
  }

  return (
    <div>
      <PageTitle
        title="Movimientos de Stock"
        sub="Registro de entradas, salidas y ajustes"
      />

      {loadError && (
        <div className="panel" style={{ marginBottom: 12, color: "#b91c1c" }}>
          {loadError}
        </div>
      )}

      <div className="mov-grid">
        <div className="panel mov-card">
          <div className="mov-title">Registrar Movimiento</div>

          {done ? (
            <div className="mov-success-wrap">
              <Ico p={I.check} size={30} />
              <p className="mov-success-text">Movimiento registrado</p>
              <button
                className="btn btn-primary mov-success-button"
                onClick={resetForm}
              >
                Nuevo registro
              </button>
            </div>
          ) : (
            <>
              <div className="mov-toggle">
                {(["Entrada", "Salida", "Ajuste"] as const).map((value) => (
                  <button
                    key={value}
                    className={`mov-toggle-btn ${type === value ? "active" : ""}`}
                    style={{
                      background: type === value ? colors[value] : "transparent",
                      color: type === value ? "white" : "#94A3B8",
                    }}
                    onClick={() => setType(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>

              {error && (
                <div style={{ color: "#b91c1c", margin: "8px 0" }}>{error}</div>
              )}

              <div className="mov-form-stack">
                <div className="field">
                  <label className="label">Producto *</label>
                  <select
                    className="select"
                    value={prod}
                    onChange={(e) => {
                      setProd(e.target.value)
                      setLoteId("")
                    }}
                  >
                    <option value="">Seleccionar…</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.codigo}>
                        {p.codigo} — {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="label">Lote</label>
                  <select
                    className="select"
                    value={loteId}
                    disabled={!prod}
                    onChange={(e) => setLoteId(e.target.value)}
                  >
                    <option value="">Seleccionar lote…</option>
                    {lotesDelProducto.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.id} · {l.ubic} · {fmt(l.qty)} L
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
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="label">Referencia</label>
                  <input
                    className="input"
                    placeholder="Ej. OC-2024-040"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="label">Observación</label>
                  <textarea
                    className="input mov-observation"
                    placeholder="Detalle adicional del movimiento"
                    rows={3}
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  disabled={saving || !prod || !loteId || !qty}
                  onClick={registerMovement}
                >
                  <Ico p={I.check} size={14} />{" "}
                  {saving ? "Registrando…" : `Confirmar ${type}`}
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
                <th>Observación</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movement) => (
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
                    className={
                      movement.qty < 0
                        ? "mov-history-qty-negative"
                        : "mov-history-qty-positive"
                    }
                  >
                    {movement.qty > 0 ? "+" : ""}
                    {fmt(movement.qty)} L
                  </td>
                  <td>{movement.lote}</td>
                  <td>{movement.ref}</td>
                  <td>{movement.observacion || "—"}</td>
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