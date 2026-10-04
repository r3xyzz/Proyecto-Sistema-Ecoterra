import React, { useMemo, useRef, useState } from "react"
import { Badge, I, Ico, PageTitle } from "../shared"

export type User = {
  id: number
  nombre: string
  email: string
  rol: string
  estado: string
  permisos?: Record<string, boolean>
}

export type UserInput = {
  nombre: string
  email: string
  rol: string
  estado: string
  permisos?: Record<string, boolean>
}

type PermissionGroup = {
  id: string
  nombre: string
  permisos: string[]
}

const roles = [
  "Superusuario / Admin",
  "Usuario con privilegios",
  "Usuario base",
]

const permissionGroups: PermissionGroup[] = [
  {
    id: "clientes",
    nombre: "Clientes",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar"],
  },
  {
    id: "direcciones",
    nombre: "Direcciones",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar"],
  },
  {
    id: "proveedores",
    nombre: "Proveedores",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar"],
  },
  {
    id: "productos",
    nombre: "Productos",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar"],
  },
  {
    id: "lotes",
    nombre: "Inventario / Lotes",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar"],
  },
  {
    id: "movimientos",
    nombre: "Movimientos de stock",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar"],
  },
  {
    id: "cotizaciones",
    nombre: "Cotizaciones",
    permisos: [
      "Crear",
      "Consultar",
      "Editar",
      "Eliminar",
      "Descargar PDF",
      "Enviar por correo",
      "Asociar a Orden de Compra",
    ],
  },
  {
    id: "ordenes_compra",
    nombre: "Órdenes de compra",
    permisos: [
      "Crear / Subir PDF",
      "Consultar",
      "Editar",
      "Eliminar",
      "Descargar PDF",
      "Generar factura",
    ],
  },
  {
    id: "facturacion",
    nombre: "Facturación",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar", "Descargar PDF", "Enviar por correo"],
  },
  {
    id: "notas_credito",
    nombre: "Notas de crédito",
    permisos: ["Crear", "Consultar", "Editar", "Eliminar", "Descargar PDF", "Enviar por correo"],
  },
  {
    id: "ia",
    nombre: "Inteligencia Artificial",
    permisos: [
      "Predicción de tiempo de llegada",
      "Predicción de precio",
      "Predicción de reposición de stock",
    ],
  },
  {
    id: "usuarios_roles",
    nombre: "Usuarios y roles",
    permisos: ["Crear usuarios", "Consultar usuarios", "Editar usuarios", "Eliminar usuarios", "Administrar roles y permisos"],
  },
]

const roleDefaults: Record<string, string[]> = {
  "Superusuario / Admin": permissionGroups.flatMap((group) =>
    group.permisos.map((permiso) => `${group.id}:${permiso}`),
  ),
  "Usuario con privilegios": [
    "clientes:Crear",
    "clientes:Consultar",
    "clientes:Editar",
    "direcciones:Crear",
    "direcciones:Consultar",
    "direcciones:Editar",
    "proveedores:Consultar",
    "productos:Crear",
    "productos:Consultar",
    "productos:Editar",
    "lotes:Consultar",
    "lotes:Editar",
    "movimientos:Consultar",
    "cotizaciones:Crear",
    "cotizaciones:Consultar",
    "cotizaciones:Editar",
    "ordenes_compra:Consultar",
    "facturacion:Consultar",
    "notas_credito:Consultar",
    "ia:Predicción de tiempo de llegada",
    "ia:Predicción de precio",
    "ia:Predicción de reposición de stock",
  ],
  "Usuario base": [
    "clientes:Consultar",
    "direcciones:Consultar",
    "proveedores:Consultar",
    "productos:Consultar",
    "lotes:Consultar",
    "movimientos:Consultar",
    "cotizaciones:Consultar",
    "ordenes_compra:Consultar",
    "facturacion:Consultar",
    "notas_credito:Consultar",
    "ia:Predicción de tiempo de llegada",
  ],
}

const buildPermissionsMap = (role: string, existing?: Record<string, boolean>) => {
  const defaults = roleDefaults[role] ?? []
  const permissions: Record<string, boolean> = {}

  permissionGroups.forEach((group) => {
    group.permisos.forEach((permiso) => {
      const key = `${group.id}:${permiso}`
      permissions[key] = defaults.includes(key) || existing?.[key] === true
    })
  })

  return permissions
}

export default function Usuarios({
  usuarios,
  loadError,
  onCreate,
  onDelete,
  onUpdate,
}: {
  usuarios: User[]
  loadError: string
  onCreate: (input: UserInput) => Promise<User>
  onDelete: (user: User) => Promise<void>
  onUpdate: (user: User, input: UserInput) => Promise<User>
}) {
  const permissionsSectionRef = useRef<HTMLDivElement | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<number>(usuarios[0]?.id ?? 1)
  const [selectedRole, setSelectedRole] = useState(usuarios[0]?.rol ?? roles[0])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [newUser, setNewUser] = useState<UserInput>({
    nombre: "",
    email: "",
    rol: roles[0],
    estado: "Activo",
    permisos: buildPermissionsMap(roles[0]),
  })

  const selectedUser = useMemo(
    () => usuarios.find((user) => user.id === selectedUserId) ?? usuarios[0],
    [selectedUserId, usuarios],
  )

  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    selectedUser?.permisos ?? buildPermissionsMap(roles[0]),
  )

  React.useEffect(() => {
    if (!selectedUser) return
    setSelectedRole(selectedUser.rol)
    setPermissions(selectedUser.permisos ?? buildPermissionsMap(selectedUser.rol))
  }, [selectedUser])

  const handleEditUser = (user: User) => {
    setSelectedUserId(user.id)
    setSelectedRole(user.rol)
    setPermissions(user.permisos ?? buildPermissionsMap(user.rol))
    setShowPermissionsPanel(true)
    setSaveError("")

    window.setTimeout(() => {
      permissionsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 50)
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    const nextPermissions = buildPermissionsMap(role)
    setPermissions(nextPermissions)
  }

  const togglePermission = (groupId: string, permiso: string) => {
    const key = `${groupId}:${permiso}`
    const nextValue = !permissions[key]

    const nextPermissions = {
      ...permissions,
      [key]: nextValue,
    }

    setPermissions(nextPermissions)
  }

  const saveSelectedUser = async () => {
    if (!selectedUser) return

    setSaving(true)
    setSaveError("")

    try {
      await onUpdate(selectedUser, {
        nombre: selectedUser.nombre,
        email: selectedUser.email,
        rol: selectedRole,
        estado: selectedUser.estado,
        permisos: permissions,
      })
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar el usuario")
    } finally {
      setSaving(false)
    }
  }

  const saveNewUser = async () => {
    setSaving(true)
    setSaveError("")

    try {
      await onCreate(newUser)
      setShowNew(false)
      setNewUser({
        nombre: "",
        email: "",
        rol: roles[0],
        estado: "Activo",
        permisos: buildPermissionsMap(roles[0]),
      })
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo crear el usuario")
    } finally {
      setSaving(false)
    }
  }

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

      {loadError && (
        <div className="panel" style={{ padding: 20, color: "#B91C1C" }}>
          {loadError}
        </div>
      )}

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
            {usuarios.map((user) => (
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
                <td style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <Ico p={I.edit} size={13} /> Editar
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      if (!window.confirm(`¿Eliminar a ${user.nombre}?`)) return
                      await onDelete(user)
                    }}
                  >
                    <Ico p={I.trash} size={13} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPermissionsPanel && (
        <div ref={permissionsSectionRef} className="panel usuarios-panel" style={{ marginTop: 18 }}>
          <div className="panel-header">
            <span className="usuarios-section-title">Roles y permisos</span>
            <Badge t="neutral">
              {selectedUser ? `Editando: ${selectedUser.nombre}` : "Prototipo"}
            </Badge>
          </div>

          <div className="usuarios-roles-grid" style={{ marginTop: 12 }}>
            {roles.map((role, index) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`usuarios-role-card ${selectedRole === role ? "active" : "inactive"}`}
              >
                <div className="usuarios-role-title">{role}</div>
                <div className="usuarios-role-desc">
                  {index === 0
                    ? "Acceso total a todos los módulos."
                    : index === 1
                      ? "Permisos seleccionables por módulo."
                      : "Solo lectura del sistema."}
                </div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18, alignItems: "center" }}>
            <button className="btn btn-primary" type="button" onClick={saveSelectedUser} disabled={saving}>
              <Ico p={I.check} size={14} /> Guardar cambios
            </button>
            {saveError && <span style={{ color: "#B91C1C" }}>{saveError}</span>}
          </div>
        </div>
      )}

      {showPermissionsPanel && (
        <div className="panel" style={{ marginTop: 18 }}>
          <div className="panel-header" style={{ marginBottom: 18 }}>
            <span className="usuarios-section-title">
              Funcionalidades y permisos del usuario seleccionado
            </span>
            <Badge t="info">{selectedRole}</Badge>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            {permissionGroups.map((group) => (
              <div
                key={group.id}
                style={{
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: 16,
                  background: "#F8FAFC",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 12, color: "#0F172A" }}>
                  {group.nombre}
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {group.permisos.map((permiso) => {
                    const key = `${group.id}:${permiso}`
                    return (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          color: "#334155",
                          fontSize: 14,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(permissions[key])}
                          onChange={() => togglePermission(group.id, permiso)}
                        />
                        <span>{permiso}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div
            className="modal usuarios-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="usuarios-modal-title">Nuevo usuario</h2>
            <div className="usuarios-form">
              <div className="field">
                <label className="label">Nombre completo</label>
                <input
                  className="input"
                  placeholder="Nombre del usuario"
                  value={newUser.nombre}
                  onChange={(event) => setNewUser((current) => ({ ...current, nombre: event.target.value }))}
                />
              </div>
              <div className="field">
                <label className="label">Correo electrónico</label>
                <input
                  className="input"
                  type="email"
                  placeholder="usuario@ecoterra.cl"
                  value={newUser.email}
                  onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div className="field">
                <label className="label">Rol</label>
                <select
                  className="select"
                  value={newUser.rol}
                  onChange={(event) => {
                    const role = event.target.value
                    setNewUser((current) => ({
                      ...current,
                      rol: role,
                      permisos: buildPermissionsMap(role),
                    }))
                  }}
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
            {saveError && <p style={{ color: "#B91C1C", marginTop: 12 }}>{saveError}</p>}
            <div className="usuarios-form-actions">
              <button className="btn btn-primary" onClick={saveNewUser} disabled={saving}>
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
