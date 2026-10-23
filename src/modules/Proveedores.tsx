import React, { useState } from "react"
import { Badge, I, Ico, PageTitle } from "../shared"

type Provider = {
  id: number
  nombre: string
  pais: string
  contacto: string
  email: string
  tel: string
  direccion: string
  estado: string
}

const PROVEEDORES: Provider[] = [
  {
    id: 1,
    nombre: "Polymer Solutions Inc.",
    pais: "EE.UU.",
    contacto: "John Williams",
    email: "jwilliams@polysol.com",
    tel: "+1 713 445 8821",
    direccion: "Houston, Texas, EE.UU.",
    estado: "Activo",
  },

  {
    id: 2,
    nombre: "ChemTrade Global LLC",
    pais: "EE.UU.",
    contacto: "Sarah Connor",
    email: "sconnor@chemtrade.com",
    tel: "+1 832 221 9043",
    direccion: "Houston, Texas, EE.UU.",
    estado: "Activo",
  },

  {
    id: 3,
    nombre: "Pacific Polymers Corp.",
    pais: "EE.UU.",
    contacto: "David Park",
    email: "dpark@pacpoly.com",
    tel: "+1 206 882 7711",
    direccion: "Seattle, Washington, EE.UU.",
    estado: "Activo",
  },

  {
    id: 4,
    nombre: "EcoQuímicos Brasil",
    pais: "Brasil",
    contacto: "Felipe Alves",
    email: "falves@ecobr.com",
    tel: "+55 11 3344 8899",
    direccion: "Sao Paulo, Brasil",
    estado: "Inactivo",
  },
]

export default function Proveedores() {
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)

  const closeModal = () => {
    setShowModal(false)
    setEditingProvider(null)
  }

  const providerFields = [
    { l: "Nombre Empresa", s: 2, value: editingProvider?.nombre ?? "" },
    { l: "País", s: 1, value: editingProvider?.pais ?? "" },
    { l: "Contacto", s: 1, value: editingProvider?.contacto ?? "" },
    { l: "Teléfono", s: 1, value: editingProvider?.tel ?? "" },
    { l: "Email", s: 2, value: editingProvider?.email ?? "" },
    {
      l: "Dirección proveedor",
      s: 2,
      value: editingProvider?.direccion ?? "",
    },
  ]

  const filtered = PROVEEDORES.filter((provider) => {
    const query = search.toLowerCase()
    return (
      provider.nombre.toLowerCase().includes(query) ||
      provider.pais.toLowerCase().includes(query) ||
      provider.contacto.toLowerCase().includes(query)
    )
  })

  return (
    <div>
      <PageTitle
        title="Proveedores"
        sub="Directorio de proveedores de materias primas"
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingProvider(null)
            setShowModal(true)
          }}
        >
          <Ico p={I.plus} size={14} /> Nuevo proveedor
        </button>
      </PageTitle>
      <div className="panel">
        <div className="panel-header">
          <div className="proveedores-search-wrap">
            <span className="proveedores-search-icon">
              <Ico p={I.search ?? I.clients} size={14} />
            </span>
            <input
              className="input proveedores-search-input"
              placeholder="Buscar por empresa, país o contacto…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <span className="proveedores-count">{filtered.length} proveedores</span>
        </div>
        <table className="dt w-full">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>País</th>
              <th>Contacto</th>
              <th>Email</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((provider) => (
              <tr key={provider.id}>
                <td className="proveedores-name">{provider.nombre}</td>
                <td>
                  <Badge t="info">{provider.pais}</Badge>
                </td>
                <td>
                  <div>{provider.contacto}</div>
                  <div className="proveedores-phone">{provider.tel}</div>
                </td>
                <td className="proveedores-email">{provider.email}</td>
                <td>
                  <Badge t={provider.estado === "Activo" ? "ok" : "neutral"}>
                    {provider.estado}
                  </Badge>
                </td>
                <td>
                  <div className="proveedores-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      title="Editar proveedor"
                      aria-label="Editar proveedor"
                      onClick={() => {
                        setEditingProvider(provider)
                        setShowModal(true)
                      }}
                    >
                      <Ico p={I.edit} size={13} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      title="Eliminar proveedor"
                      aria-label="Eliminar proveedor"
                    >
                      <Ico p={I.trash} size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal proveedores-modal"
            onClick={(event) => event.stopPropagation()}
            key={editingProvider?.id ?? "new"}
          >
            <div className="proveedores-modal-header">
              <h2 className="proveedores-modal-title">
                {editingProvider ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h2>
              <button onClick={closeModal} className="proveedores-modal-close">
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div className="proveedores-form-grid">
              {providerFields.map((field) => (
                <div key={field.l} className={`field ${field.s === 2 ? "proveedores-field-span-2" : "proveedores-field-span-1"}`}>
                  <label className="label">{field.l}</label>
                  <input
                    className="input"
                    placeholder={field.l}
                    defaultValue={field.value}
                  />
                </div>
              ))}
              <div className="field proveedores-field-span-1">
                <label className="label">Estado</label>
                <select
                  className="input"
                  defaultValue={editingProvider?.estado ?? "Activo"}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="proveedores-form-actions">
              <button
                className="btn btn-primary proveedores-save"
                onClick={closeModal}
              >
                <Ico p={I.check} size={14} /> Guardar
              </button>
              <button
                className="btn btn-ghost"
                onClick={closeModal}
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
