import React, { useState } from "react"
import { Badge, fmt, I, Ico, PageTitle, Product } from "../shared"

export default function Productos({ productos }: { productos: Product[] }) {
  const [tipo, setTipo] = useState("")
  const [estado, setEstado] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const tipos = [...new Set(productos.map((product) => product.tipo))]
  const estados = [...new Set(productos.map((product) => product.estado))]
  const filtered = productos.filter(
    (product) =>
      (!tipo || product.tipo === tipo) &&
      (!estado || product.estado === estado),
  )

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const productFields = [
    { label: "Código", value: editingProduct?.codigo ?? "", span: 1 },
    { label: "Nombre", value: editingProduct?.nombre ?? "", span: 1 },
    { label: "Descripción", value: editingProduct?.desc ?? "", span: 2 },
    { label: "Tipo", value: editingProduct?.tipo ?? "", span: 1 },
    { label: "Unidad", value: editingProduct?.unidad ?? "", span: 1 },
    {
      label: "Stock Mínimo",
      value: editingProduct?.stockMin ?? "",
      span: 1,
    },
  ]

  return (
    <div>
      <PageTitle
        title="Catálogo de Productos"
        sub="Polímeros industriales Ecoterra"
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingProduct(null)
            setShowModal(true)
          }}
        >
          <Ico p={I.plus ?? "M12 5v14M5 12h14"} size={14} /> Nuevo producto
        </button>
      </PageTitle>
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: "flex", gap: 8 }}>
            <select
              className="select"
              style={{ width: 190 }}
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
            >
              <option value="">Todos los tipos</option>
              {tipos.map((productType) => (
                <option key={productType} value={productType}>
                  {productType}
                </option>
              ))}
            </select>
            <select
              className="select"
              style={{ width: 170 }}
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
            >
              <option value="">Todos los estados</option>
              {estados.map((productStatus) => (
                <option key={productStatus} value={productStatus}>
                  {productStatus}
                </option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
            {filtered.length} productos
          </span>
        </div>
        <table className="dt w-full">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Unidad</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              return (
                <tr key={product.id}>
                  <td
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#0052CC",
                    }}
                  >
                    {product.codigo}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>
                      {product.nombre}
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "#94A3B8" }}>
                      {product.desc}
                    </div>
                  </td>
                  <td>
                    <Badge t="info">{product.tipo}</Badge>
                  </td>
                  <td style={{ color: "#475569" }}>{product.unidad}</td>
                  <td style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {fmt(product.stockMin)} L
                  </td>
                  <td>
                    <Badge
                      t={product.estado === "Activo" ? "ok" : "neutral"}
                    >
                      {product.estado}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Editar producto"
                        aria-label="Editar producto"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #0052CC",
                          color: "#0052CC",
                        }}
                        onClick={() => {
                          setEditingProduct(product)
                          setShowModal(true)
                        }}
                      >
                        <Ico p={I.edit} size={13} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Eliminar producto"
                        aria-label="Eliminar producto"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #DC2626",
                          color: "#DC2626",
                        }}
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Ico p={I.trash} size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal"
            style={{ width: 540, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
            key={editingProduct?.id ?? "new"}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Cerrar formulario"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                }}
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {productFields.map((field) => (
                <div
                  className="field"
                  key={field.label}
                  style={{ gridColumn: `span ${field.span}` }}
                >
                  <label className="label">{field.label}</label>
                  <input
                    className="input"
                    placeholder={field.label}
                    defaultValue={field.value}
                    type={
                      field.label === "Stock Mínimo" ? "number" : "text"
                    }
                  />
                </div>
              ))}
              <div className="field" style={{ gridColumn: "span 1" }}>
                <label className="label">Estado</label>
                <select
                  className="input"
                  defaultValue={editingProduct?.estado ?? "Activo"}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={closeModal}
              >
                <Ico p={I.check} size={14} /> Guardar
              </button>
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setDeletingProduct(null)}
        >
          <div
            className="modal"
            style={{ width: 420, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
              Eliminar producto
            </h2>
            <p
              style={{
                color: "#475569",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                marginTop: 10,
              }}
            >
              ¿Deseas eliminar {deletingProduct.nombre} del catálogo?
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button
                className="btn btn-danger"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setDeletingProduct(null)}
              >
                Eliminar
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setDeletingProduct(null)}
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
