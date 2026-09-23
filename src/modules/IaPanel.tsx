import React from "react"
import { Badge, I, Ico, PageTitle, Product } from "../shared"

export default function IaPanel({ productos }: { productos: Product[] }) {
  return (
    <div>
      <PageTitle
        title="Panel de Inteligencia Artificial"
        sub="Modelos predictivos entrenados con datos operativos de Ecoterra"
      />
      <div className="ia-grid">
        <div className="panel">
          <div className="panel-header">
            <span>
              <Ico p={I.ship} size={15} /> Predicción · Tiempo de Llegada
            </span>
            <Badge t="neutral">Sin resultado</Badge>
          </div>
          <div className="ia-card-body">
            <div className="field">
              <label className="label">Puerto de origen</label>
              <select className="select">
                <option>Corpus Christi, TX</option>
                <option>Miami, FL</option>
                <option>Los Angeles, CA</option>
              </select>
            </div>
            <button
              className="btn btn-primary"
              className="btn btn-primary ia-button"
            >
              <Ico p={I.sparkle} size={14} /> Calcular Predicción
            </button>
          </div>
        </div>
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
            <button
              className="btn btn-navy"
              className="btn btn-navy ia-button"
            >
              Predecir Precio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
