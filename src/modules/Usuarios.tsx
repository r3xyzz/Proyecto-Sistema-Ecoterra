import React, { useState } from "react"

import { Badge, I, Ico, PageTitle } from "../shared"

type User = {
  id: number
  nombre: string
  email: string
  rol: string
  estado: string
}

const roles = [
  "Superusuario / Admin",
  "Usuario con privilegios",
  "Usuario base",
]

export default function Usuarios() {
  const [showNew, setShowNew] = useState(false)

  const [selectedRole, setSelectedRole] = useState(roles[0])

  const users: User[] = [
    {
      id: 1,
      nombre: "Juan Rojas",
      email: "juan.rojas@ecoterra.cl",
      rol: roles[0],
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "María López",
      email: "maria.lopez@ecoterra.cl",
      rol: roles[1],
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Pedro García",
      email: "pedro.garcia@ecoterra.cl",
      rol: roles[2],
      estado: "Activo",
    },
  ]

  return (
    <div>
      <PageTitle
        title="Gestión de Usuarios"
        sub="Usuarios, roles y permisos del sistema"
      >
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Ico p={I.plus} size={14} /> Nuevo usuario
        </button>
      </PageTitle>
      <div className="panel">
        <table className="dt w-full">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>{user.nombre}</td>
                <td>{user.email}</td>
                <td>
                  <Badge
                    t={
                      user.rol === roles[0]
                        ? "danger"
                        : user.rol === roles[1]
                          ? "info"
                          : "neutral"
                    }
                  >
                    {user.rol}
                  </Badge>
                </td>
                <td>
                  <Badge t="ok">{user.estado}</Badge>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">
                    <Ico p={I.edit} size={13} /> Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-header">
          <span style={{ fontWeight: 700, color: "#0F172A" }}>
            Roles y permisos
          </span>
          <Badge t="neutral">Prototipo</Badge>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            padding: 18,
          }}
        >
          {roles.map((role, index) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                textAlign: "left",
                padding: 16,
                border: `1px solid ${
                  selectedRole === role ? "#00995A" : "#E2E8F0"
                }`,
                borderRadius: 8,
                background: selectedRole === role ? "#F0FDF4" : "white",
                cursor: "pointer",
              }}
            >
              <div
                style={{ fontWeight: 700, color: "#0F172A", marginBottom: 8 }}
              >
                {role}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                {index === 0
                  ? "Acceso total a todos los módulos."
                  : index === 1
                    ? "Permisos seleccionables por módulo."
                    : "Solo lectura del sistema."}
              </div>
            </button>
          ))}
        </div>
      </div>
      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div
            className="modal"
            style={{ width: 480, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 18 }}>
              Nuevo usuario
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="field">
                <label className="label">Nombre completo</label>
                <input className="input" placeholder="Nombre del usuario" />
              </div>
              <div className="field">
                <label className="label">Correo electrónico</label>
                <input
                  className="input"
                  type="email"
                  placeholder="usuario@ecoterra.cl"
                />
              </div>
              <div className="field">
                <label className="label">Rol</label>
                <select
                  className="select"
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </div>
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
