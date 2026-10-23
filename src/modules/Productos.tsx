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
          <div className="productos-filter-row">
            <select
              className="select productos-filter-a"
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
              className="select productos-filter-b"
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
          <span className="productos-count">{filtered.length} productos</span>
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
                  <td className="productos-code">{product.codigo}</td>
                  <td>
                    <div className="productos-name">{product.nombre}</div>
                    <div className="productos-desc">{product.desc}</div>
                  </td>
                  <td>
                    <Badge t="info">{product.tipo}</Badge>
                  </td>
                  <td className="productos-unit">{product.unidad}</td>
                  <td className="productos-meta">
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
                    <div className="productos-actions">
                      <button
                        className="btn btn-ghost btn-sm productos-edit-btn"
                        title="Editar producto"
                        aria-label="Editar producto"
                        onClick={() => {
                          setEditingProduct(product)
                          setShowModal(true)
                        }}
                      >
                        <Ico p={I.edit} size={13} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm productos-delete-btn"
                        title="Eliminar producto"
                        aria-label="Eliminar producto"
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
            className="modal productos-modal"
            onClick={(event) => event.stopPropagation()}
            key={editingProduct?.id ?? "new"}
          >
            <div className="productos-modal-header">
              <h2 className="productos-modal-title">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Cerrar formulario"
                className="productos-modal-close"
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="productos-form-grid">
              {productFields.map((field) => (
                <div
                  key={field.label}
                  className={`field ${field.span === 2 ? "productos-span-2" : "productos-span-1"}`}
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
              <div className="field productos-span-1">
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
            <div className="productos-form-actions">
              <button
                className="btn btn-primary productos-save"
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
            className="modal productos-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="productos-delete-header">
              <h2 className="productos-delete-title">
                Eliminar producto
              </h2>
            </div>
            <p className="productos-delete-text">
              ¿Deseas eliminar {deletingProduct.nombre} del catálogo?
            </p>
            <div className="productos-delete-actions">
              <button
                className="btn btn-danger productos-delete-confirm"
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