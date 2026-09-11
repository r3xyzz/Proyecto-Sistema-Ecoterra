import React, { useState } from "react"

import { Badge, I, Ico, PageTitle } from "../shared"

type Client = {
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

export default function Clientes({ clientes }: { clientes: Client[] }) {
  const [search, setSearch] = useState("")

  const [selected, setSelected] = useState<Client | null>(null)

  const [showNew, setShowNew] = useState(false)

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
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Ico p={I.plus} size={14} /> Nuevo cliente
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
              placeholder="Buscar por razón social o RUT…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
            {filtered.length} clientes
          </span>
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
                style={{ cursor: "pointer" }}
              >
                <td
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.75rem",
                    color: "#64748B",
                  }}
                >
                  {client.rut}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#0F172A" }}>
                    {client.razon}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "#94A3B8" }}>
                    {client.fantasia}
                  </div>
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
                    Ver detalles <Ico p={I.chevR} size={12} />
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
            <div style={{ padding: 20, borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "0.6875rem", color: "#64748B" }}>
                    {selected.rut}
                  </span>
                  <h2
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {selected.razon}
                  </h2>
                  <p style={{ fontSize: "0.75rem", color: "#64748B" }}>
                    {selected.fantasia} · {selected.ciudad}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
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
            </div>
            <div style={{ padding: 20, display: "grid", gap: 14 }}>
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
                <label className="label">
                  Direcciones ({selected.dirs.length})
                </label>
                {selected.dirs.map((address) => (
                  <div
                    key={address.id}
                    style={{
                      marginTop: 8,
                      padding: 10,
                      background: "#F8FAFC",
                      borderRadius: 7,
                      fontSize: "0.75rem",
                    }}
                  >
                    {address.nombre} · {address.ciudad}{" "}
                    <Badge t={address.principal ? "ok" : "neutral"}>
                      {address.tipo}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div
            className="modal"
            style={{ width: 540, padding: 24 }}
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
                "RUT",
                "Razón Social",
                "Nombre de Fantasía",
                "Ciudad",
                "Teléfono",
                "Correo Electrónico",
                "Representante",
              ].map((label) => (
                <div className="field" key={label}>
                  <label className="label">{label}</label>
                  <input className="input" placeholder={label} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowNew(false)}
              >
                <Ico p={I.check} size={14} /> Guardar
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowNew(false)}
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
