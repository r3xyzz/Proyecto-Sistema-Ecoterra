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
          <div style={{ position: "relative", width: 280 }}>
            <span
              style={{
                position: "absolute",
                left: 9,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
              }}
            >
              <Ico p={I.search ?? I.clients} size={14} />
            </span>
            <input
              className="input"
              style={{ paddingLeft: 30 }}
              placeholder="Buscar por empresa, país o contacto…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
            {filtered.length} proveedores
          </span>
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
                <td style={{ fontWeight: 600, color: "#0F172A" }}>
                  {provider.nombre}
                </td>
                <td>
                  <Badge t="info">{provider.pais}</Badge>
                </td>
                <td>
                  <div>{provider.contacto}</div>
                  <div style={{ fontSize: "0.6875rem", color: "#94A3B8" }}>
                    {provider.tel}
                  </div>
                </td>
                <td style={{ color: "#0052CC", fontSize: "0.8125rem" }}>
                  {provider.email}
                </td>
                <td>
                  <Badge t={provider.estado === "Activo" ? "ok" : "neutral"}>
                    {provider.estado}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
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
            className="modal"
            style={{ width: 480, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
            key={editingProvider?.id ?? "new"}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
                {editingProvider ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h2>
              <button
                onClick={closeModal}
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
              {providerFields.map((field) => (
                <div
                  key={field.l}
                  className="field"
                  style={{ gridColumn: `span ${field.s}` }}
                >
                  <label className="label">{field.l}</label>
                  <input
                    className="input"
                    placeholder={field.l}
                    defaultValue={field.value}
                  />
                </div>
              ))}
              <div className="field" style={{ gridColumn: "span 1" }}>
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
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
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
