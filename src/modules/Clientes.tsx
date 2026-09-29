import React, { useState } from "react"
import { Badge, I, Ico, PageTitle } from "../shared"

export type Client = {
  id: number
  rut: string
  razon: string
  fantasia: string
  ciudad: string
  tel: string
  email: string
  rep: string
  estado: string
  dirs: {
    id: number
    nombre: string
    ciudad: string
    tipo: string
    principal: boolean
  }[]
}

export type NewClientInput = Omit<Client, "id" | "dirs"> & {
  razon_social: string
  nombre_fantasia: string
  telefono: string
  representante: string
}

const emptyNewClient: NewClientInput = {
  rut: "",
  razon: "",
  fantasia: "",
  ciudad: "",
  tel: "",
  email: "",
  rep: "",
  estado: "Activo",
  razon_social: "",
  nombre_fantasia: "",
  telefono: "",
  representante: "",
}

const clientToInput = (client: Client): NewClientInput => ({
  ...emptyNewClient,
  rut: client.rut,
  razon: client.razon,
  fantasia: client.fantasia,
  ciudad: client.ciudad,
  tel: client.tel,
  email: client.email,
  rep: client.rep,
  estado: client.estado,
  razon_social: client.razon,
  nombre_fantasia: client.fantasia,
  telefono: client.tel === "-" ? "" : client.tel,
  representante: client.rep === "-" ? "" : client.rep,
})

export default function Clientes({
  clientes,
  onCreate,
  onDelete,
  onUpdate,
}: {
  clientes: Client[]
  onCreate: (client: NewClientInput) => Promise<Client>
  onDelete: (client: Client) => Promise<void>
  onUpdate: (client: Client, input: NewClientInput) => Promise<Client>
}) {
  const [search, setSearch] = useState("")

  const [selected, setSelected] = useState<Client | null>(null)

  const [showNew, setShowNew] = useState(false)
  const [newClient, setNewClient] = useState(emptyNewClient)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [editing, setEditing] = useState(false)
  const [editClient, setEditClient] = useState<NewClientInput>(emptyNewClient)
  const [editError, setEditError] = useState("")

  const openNewClient = () => {
    setNewClient(emptyNewClient)
    setSaveError("")
    setShowNew(true)
  }

  const updateNewClient = (field: keyof NewClientInput, value: string) => {
    setNewClient((current) => ({ ...current, [field]: value }))
  }

  const saveNewClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setSaveError("")

    try {
      await onCreate(newClient)
      setShowNew(false)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar el cliente")
    } finally {
      setSaving(false)
    }
  }

  const deleteSelectedClient = async () => {
    if (!selected || !window.confirm(`¿Eliminar a ${selected.razon}?`)) return

    setDeleteError("")
    try {
      await onDelete(selected)
      setSelected(null)
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "No se pudo eliminar el cliente",
      )
    }
  }

  const startEditing = () => {
    if (!selected) return
    setEditClient(clientToInput(selected))
    setEditError("")
    setEditing(true)
  }

  const updateEditClient = (field: keyof NewClientInput, value: string) => {
    setEditClient((current) => ({ ...current, [field]: value }))
  }

  const saveEditedClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected) return

    setSaving(true)
    setEditError("")
    try {
      const updated = await onUpdate(selected, editClient)
      setSelected(updated)
      setEditing(false)
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "No se pudo actualizar el cliente")
    } finally {
      setSaving(false)
    }
  }

  const filtered = clientes.filter(
    (client) =>
      client.razon.toLowerCase().includes(search.toLowerCase()) ||
      client.rut.includes(search),
  )

  return (
    <div>
      <PageTitle
        title="Gestión de Clientes"
        sub="Clientes y sus múltiples direcciones de entrega"
      >
        <button className="btn btn-primary" onClick={openNewClient}>
          <Ico p={I.plus} size={14} /> Nuevo cliente
        </button>
      </PageTitle>
      <div className="panel">
        <div className="panel-header">
          <div className="clientes-search-wrap">
            <span className="clientes-search-icon">
              <Ico p={I.search ?? I.clients} size={14} />
            </span>
            <input
              className="input clientes-search-input"
              placeholder="Buscar por razón social o RUT…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <span className="clientes-count">{filtered.length} clientes</span>
        </div>
        <table className="dt w-full">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Razón Social</th>
              <th>Ciudad</th>
              <th>Representante</th>
              <th>Teléfono</th>
              <th>Dirs.</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr
                key={client.id}
                onClick={() => setSelected(client)}
                className="clientes-row"
              >
                <td className="clientes-rut">{client.rut}</td>
                <td>
                  <div className="clientes-name">{client.razon}</div>
                  <div className="clientes-fantasia">{client.fantasia}</div>
                </td>
                <td>{client.ciudad}</td>
                <td>{client.rep}</td>
                <td>{client.tel}</td>
                <td>
                  <Badge t={client.dirs.length ? "info" : "neutral"}>
                    {client.dirs.length}
                  </Badge>
                </td>
                <td>
                  <Badge t={client.estado === "Activo" ? "ok" : "neutral"}>
                    {client.estado}
                  </Badge>
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(event) => {
                      event.stopPropagation()
                      setSelected(client)
                    }}
                  >
                    Detalles <Ico p={I.chevR} size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="slideover-backdrop" onClick={() => setSelected(null)}>
          <div
            className="slideover"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="clientes-detail-header">
              <div className="clientes-detail-title-row">
                <div>
                  <span className="clientes-detail-rut">{selected.rut}</span>
                  <h2 className="clientes-detail-title">{selected.razon}</h2>
                  <p className="clientes-detail-subtitle">
                    {selected.fantasia} · {selected.ciudad}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="clientes-detail-close">
                  <Ico p={I.x} size={18} />
                </button>
              </div>
            </div>
            {editing ? (
              <form className="clientes-detail-body" onSubmit={saveEditedClient}>
                {[
                  ["RUT", "rut"],
                  ["Razón Social", "razon_social"],
                  ["Nombre de Fantasía", "nombre_fantasia"],
                  ["Ciudad", "ciudad"],
                  ["Teléfono", "telefono"],
                  ["Correo Electrónico", "email"],
                  ["Representante", "representante"],
                ].map(([label, field]) => (
                  <div className="field" key={label}>
                    <label className="label">{label}</label>
                    <input
                      className="input"
                      value={editClient[field as keyof NewClientInput]}
                      onChange={(event) =>
                        updateEditClient(field as keyof NewClientInput, event.target.value)
                      }
                      required={field === "rut" || field === "razon_social" || field === "ciudad"}
                      type={field === "email" ? "email" : "text"}
                    />
                  </div>
                ))}
                <div className="field">
                  <label className="label">Estado</label>
                  <select
                    className="input"
                    value={editClient.estado}
                    onChange={(event) => updateEditClient("estado", event.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                {editError && <p style={{ color: "#B91C1C" }}>{editError}</p>}
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    <Ico p={I.check} size={14} /> Guardar cambios
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="clientes-detail-body">
                {[
                  { label: "Estado", value: selected.estado },
                  { label: "Teléfono", value: selected.tel },
                  { label: "Correo Electrónico", value: selected.email },
                  { label: "Representante", value: selected.rep },
                ].map((field) => (
                  <div className="field" key={field.label}>
                    <label className="label">{field.label}</label>
                    <input className="input" value={field.value} readOnly />
                  </div>
                ))}
                <div>
                  <label className="label">Direcciones ({selected.dirs.length})</label>
                  {selected.dirs.map((address) => (
                    <div key={address.id} className="clientes-address">
                      {address.nombre} · {address.ciudad}{" "}
                      <Badge t={address.principal ? "ok" : "neutral"}>{address.tipo}</Badge>
                    </div>
                  ))}
                </div>
                {deleteError && <p style={{ color: "#B91C1C", marginTop: 12 }}>{deleteError}</p>}
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  <button className="btn btn-primary" type="button" onClick={startEditing}>
                    <Ico p={I.edit} size={14} /> Editar cliente
                  </button>
                  <button className="btn btn-danger" type="button" onClick={deleteSelectedClient}>
                    <Ico p={I.trash} size={14} /> Eliminar cliente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <form
            className="modal"
            style={{ width: 540, padding: 24 }}
            onSubmit={saveNewClient}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 18 }}>
              Nuevo Cliente
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                ["RUT", "rut"],
                ["Razón Social", "razon_social"],
                ["Nombre de Fantasía", "nombre_fantasia"],
                ["Ciudad", "ciudad"],
                ["Teléfono", "telefono"],
                ["Correo Electrónico", "email"],
                ["Representante", "representante"],
              ].map(([label, field]) => (
                <div className="field" key={label}>
                  <label className="label">{label}</label>
                  <input
                    className="input"
                    placeholder={label}
                    value={newClient[field as keyof NewClientInput]}
                    onChange={(event) =>
                      updateNewClient(field as keyof NewClientInput, event.target.value)
                    }
                    required={field === "rut" || field === "razon_social" || field === "ciudad"}
                    type={field === "email" ? "email" : "text"}
                  />
                </div>
              ))}
              <div className="field">
                <label className="label">Estado</label>
                <select
                  className="input"
                  value={newClient.estado}
                  onChange={(event) => updateNewClient("estado", event.target.value)}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            {saveError && <p style={{ color: "#B91C1C", marginTop: 12 }}>{saveError}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                <Ico p={I.check} size={14} /> Guardar
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setShowNew(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
