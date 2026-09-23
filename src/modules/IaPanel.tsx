import React from "react"
import { Badge, I, Ico, PageTitle, Product } from "../shared"

export default function IaPanel({ productos }: { productos: Product[] }) {
  // Datos de ejemplo para las alertas de stockout (hardcodeados según la captura)
  const stockAlerts = [
    {
      id: "POL-002",
      nombre: "EcoDust Control Supresor de Polvo 25L",
      estado: "Bajo mínimo",
      badgeT: "warn" as const,
      stock: 300,
      minimo: 1000,
      dias: 5,
    },
    {
      id: "POL-003",
      nombre: "EcoMine Heavy Duty 1000L",
      estado: "Sin stock",
      badgeT: "danger" as const,
      stock: 0,
      minimo: 2000,
      dias: 0,
    },
    {
      id: "POL-005",
      nombre: "EcoAgroPol Aplicación Agrícola 25L",
      estado: "Bajo mínimo",
      badgeT: "warn" as const,
      stock: 200,
      minimo: 800,
      dias: 7,
    },
  ]

  const totalAlertas = stockAlerts.length

  return (
    <div>
      <PageTitle
        title="Panel de Inteligencia Artificial"
        sub="Modelos predictivos entrenados con datos operativos de Ecoterra"
      />

      {/* ── Grid de Modelos Predictivos ─────────────────────── */}
      <div className="ia-grid">
        {/* Modelo 1: Tiempo de Llegada */}
        <div className="panel">
          <div className="panel-header">
            <span>
              <Ico p={I.ship} size={15} /> Predicción · Tiempo de Llegada
            </span>
            <Badge t="info">Modelo v2.1</Badge>
          </div>
          <div className="ia-card-body">
            <div className="ia-form-grid">
              <div className="field">
                <label className="label">Puerto de origen</label>
                <select className="select">
                  <option>Corpus Christi, TX</option>
                  <option>Miami, FL</option>
                  <option>Los Angeles, CA</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Naviera</label>
                <select className="select">
                  <option>MSC</option>
                  <option>Maersk</option>
                  <option>CMA CGM</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Tipo de carga</label>
                <select className="select">
                  <option>IBC 1000 L</option>
                  <option>Tambor 200 L</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Mes de embarque</label>
                <select className="select">
                  <option>Julio</option>
                  <option>Agosto</option>
                  <option>Septiembre</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary ia-button">
              <Ico p={I.sparkle} size={14} /> Calcular Predicción
            </button>
          </div>
        </div>

        {/* Modelo 2: Precio de Compra */}
        <div className="panel">
          <div className="panel-header">
            <span>
              <Ico p={I.bar} size={15} /> Predicción · Precio de Compra
            </span>
            <Badge t="info">Modelo v1.4</Badge>
          </div>
          <div className="ia-card-body">
            <div className="field">
              <label className="label">Producto</label>
              <select className="select">
                <option>Seleccionar producto…</option>
                {productos.map((product) => (
                  <option key={product.id}>
                    {product.codigo} · {product.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="ia-form-grid">
              <div className="field">
                <label className="label">Fecha estimada</label>
                <input
                  className="input"
                  type="date"
                  defaultValue="2024-09-01"
                />
              </div>
              <div className="field">
                <label className="label">Cantidad (unidades)</label>
                <input className="input" type="number" defaultValue="10" />
              </div>
            </div>
            <button className="btn btn-navy ia-button">
              <Ico p={I.sparkle} size={14} /> Predecir Precio
            </button>
            <div className="ia-empty-state">
              Selecciona producto y fecha para ver predicción.
            </div>
          </div>
        </div>
      </div>

      {/* ── Alertas de Stockout ─────────────────────────────── */}
      <div className="panel ia-alerts-panel">
        <div className="ia-alerts-header">
          <div className="ia-alerts-title">
            <Ico p={I.alert} size={16} />
            <span>Alertas de Stockout — Sistema Automatizado</span>
            <Badge t="danger">{totalAlertas} alertas</Badge>
          </div>
          <button className="btn btn-ghost">
            <Ico p={I.download} size={14} /> Generar Informe Predicción PDF
          </button>
        </div>

        <div className="ia-alerts-list">
          {stockAlerts.map((alert) => (
            <div key={alert.id} className="ia-alert-item">
              <div className="ia-alert-icon">
                <Ico p={I.alert} size={16} />
              </div>
              <div className="ia-alert-content">
                <div className="ia-alert-title-row">
                  <span className="ia-alert-name">{alert.nombre}</span>
                  <span className="ia-alert-code">{alert.id}</span>
                  <Badge t={alert.badgeT}>{alert.estado}</Badge>
                </div>
                <div className="ia-alert-meta">
                  Stock: {alert.stock} L / Mínimo: {alert.minimo} L
                </div>
                <div className="ia-alert-progress">
                  <div
                    className={`ia-alert-progress-fill ${alert.badgeT === "danger" ? "bg-danger" : "bg-warn"}`}
                    style={{ width: `${Math.min((alert.stock / alert.minimo) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="ia-alert-side">
                <div className={`ia-alert-days ${alert.badgeT === "danger" ? "text-danger" : "text-warn"}`}>
                  {alert.dias}
                </div>
                <div className="ia-alert-days-label">días restantes</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}