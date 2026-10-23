import React, { useState } from "react"
import { Badge, fmt, I, Ico, PageTitle } from "../shared"

type Lot = {
  id: string
  prod: string
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
  const [showModal, setShowModal] = useState(false)

  const lotFields = [
    { label: "ID Lote", type: "text", span: 1 },
    { label: "Producto", type: "text", span: 1 },
    { label: "Cantidad", type: "number", span: 1 },
    { label: "Envase", type: "text", span: 1 },
    { label: "Fabricación", type: "date", span: 1 },
    { label: "Vencimiento", type: "date", span: 1 },
    { label: "Ubicación", type: "text", span: 2 },
  ]

  const filtered = lotes.filter(
    (lot) =>
      (!envase || lot.envase === envase) && (!estado || lot.estado === estado),
  )

  const maxQty = Math.max(...lotes.map((lot) => lot.qty), 1)

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
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Ico p={I.plus} size={14} /> Registrar lote
        </button>
      </PageTitle>
      <div className="lotes-kpi-grid">
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
          <div className="kpi-value tabular lotes-danger-value">
            {lotes.filter((lot) => lot.qty === 0).length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Próx. a vencer</div>
          <div className="kpi-value tabular lotes-warn-value">
            {lotes.filter((lot) => expiringSoon(lot.venc)).length}
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <div className="lotes-filter-row">
            <select
              className="select lotes-filter-a"
              value={envase}
              onChange={(event) => setEnvase(event.target.value)}
            >
              <option value="">Todos los envases</option>
              <option>Tambo 200 L</option>
              <option>IBC 1000 L</option>
            </select>
            <select
              className="select lotes-filter-b"
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
            >
              <option value="">Todos los estados</option>
              <option>Disponible</option>
              <option>Reservado</option>
            </select>
          </div>
          <span className="lotes-count">{filtered.length} lotes</span>
        </div>
        <table className="dt w-full">
          <thead>
            <tr>
              <th>ID Lote</th>
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
                <td className="lotes-id">{lot.id}</td>
                <td className="lotes-prod">{lot.prod}</td>
                <td className={`lotes-qty ${lot.qty === 0 ? "lotes-qty-danger" : "lotes-qty-normal"}`}>
                  <div className="lotes-qty-stack">
                    <span>{fmt(lot.qty)} L</span>
                    <div className="progress lotes-progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(lot.qty / maxQty) * 100}%`,
                          background: lot.qty === 0 ? "#DC2626" : "#00995A",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <Badge t="neutral">{lot.envase}</Badge>
                </td>
                <td>{lot.fabr}</td>
                <td className={expiringSoon(lot.venc) ? "lotes-venc-warn" : "lotes-venc"}>
                  {expiringSoon(lot.venc) && "⚠ "}
                  {lot.venc}
                </td>
                <td>
                  <code className="lotes-location">{lot.ubic}</code>
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
      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal lotes-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lotes-modal-header">
              <h2 className="lotes-modal-title">
                Registrar lote
              </h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Cerrar formulario"
                className="lotes-modal-close"
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="lotes-form-grid">
              {lotFields.map((field) => (
                <div
                  className={`field ${field.span === 2 ? "lotes-span-2" : "lotes-span-1"}`}
                  key={field.label}
                >
                  <label className="label">{field.label}</label>
                  <input
                    className="input"
                    placeholder={field.label}
                    type={field.type}
                  />
                </div>
              ))}
              <div className="field lotes-span-1">
                <label className="label">Estado</label>
                <select className="input" defaultValue="Disponible">
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                </select>
              </div>
            </div>
            <div className="lotes-form-actions">
              <button
                className="btn btn-primary lotes-save"
                onClick={() => setShowModal(false)}
              >
                <Ico p={I.check} size={14} /> Guardar
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
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
