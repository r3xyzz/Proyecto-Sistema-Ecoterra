// usuarios.tsx
import React, { useEffect, useMemo, useState } from "react"
import { Badge, AuthUser, I, Ico, PageTitle, authHeaders } from "../shared"

export type User = {
  id: number
  nombre: string
  email: string
  rol: string
  id_rol?: number
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

type PermisoCatalogo = {
  id: number
  nombre: string
  modulo: string
  descripcion: string
}

const ROLE_DISPLAY: Record<number, string> = {
  1: "Superusuario / Admin",
  2: "Usuario con privilegios",
  3: "Usuario base",
}

const ROLE_ID_BY_NAME: Record<string, number> = {
  "Superusuario / Admin": 1,
  "Usuario con privilegios": 2,
  "Usuario base": 3,
}

const NOMBRES_MODULO: Record<string, string> = {
  clientes: "Clientes",
  direcciones: "Direcciones",
  proveedores: "Proveedores",
  productos: "Productos",
  lotes: "Inventario / Lotes",
  movimientos: "Movimientos de stock",
  cotizaciones: "Cotizaciones",
  ordenes_compra: "Órdenes de compra",
  facturacion: "Facturación",
  notas_credito: "Notas de crédito",
  ia: "Inteligencia Artificial",
  usuarios_roles: "Usuarios y roles",
}

export default function Usuarios({
  usuarios,
  loadError,
  onCreate,
  onDelete,
  onUpdate,
  authUser,
}: {
  usuarios: User[]
  loadError: string
  onCreate: (input: UserInput) => Promise<User>
  onDelete: (user: User) => Promise<void>
  onUpdate: (user: User, input: UserInput) => Promise<User>
  authUser: AuthUser | null
}) {
  const isAdmin = authUser?.id_rol === 1

  const [showNew, setShowNew] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(1)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const [newUser, setNewUser] = useState<UserInput>({
    nombre: "",
    email: "",
    rol: "Usuario base",
    estado: "Activo",
  })

  const [catalogo, setCatalogo] = useState<PermisoCatalogo[]>([])
  const [rolPermisoIds, setRolPermisoIds] = useState<Set<number>>(new Set())
  const [permisoIdsOriginales, setPermisoIdsOriginales] = useState<Set<number>>(new Set())

  // -------------------- CARGA DE DATOS --------------------
  // Cargar catálogo de permisos al montar (solo Admin)
  useEffect(() => {
    if (!isAdmin) return
    fetch("/api/permisos/")
      .then((r) => r.json())
      .then((data) => setCatalogo(Array.isArray(data) ? data : []))
      .catch(() => setCatalogo([]))
  }, [isAdmin])

  // Cargar permisos del rol seleccionado (solo Admin)
  useEffect(() => {
    if (!isAdmin || !selectedRoleId) return
    fetch(`/api/roles/${selectedRoleId}/permisos/`)
      .then((r) => r.json())
      .then((data) => {
        const ids = new Set<number>((data.permisos ?? []).map((p: any) => p.id))
        setRolPermisoIds(new Set(ids))
        setPermisoIdsOriginales(new Set(ids))
      })
      .catch(() => {
        setRolPermisoIds(new Set())
        setPermisoIdsOriginales(new Set())
      })
  }, [isAdmin, selectedRoleId])

  // -------------------- DETECTAR CAMBIOS --------------------
  const hasChanges = useMemo(() => {
    if (rolPermisoIds.size !== permisoIdsOriginales.size) return true
    for (const id of rolPermisoIds) {
      if (!permisoIdsOriginales.has(id)) return true
    }
    return false
  }, [rolPermisoIds, permisoIdsOriginales])

  // -------------------- HANDLERS --------------------
  const handleRoleChange = (roleId: number) => {
    setSelectedRoleId(roleId)
  }

  const togglePermission = (idPermiso: number) => {
    setRolPermisoIds((current) => {
      const next = new Set(current)
      if (next.has(idPermiso)) next.delete(idPermiso)
      else next.add(idPermiso)
      return next
    })
  }

  const guardarPermisos = async () => {
    if (!authUser || !isAdmin) return
    setSaving(true)
    setSaveError("")
    setSaveStatus("saving")
    try {
      const res = await fetch(`/api/roles/${selectedRoleId}/permisos/`, {
        method: "PUT",
        headers: authHeaders(authUser),
        body: JSON.stringify({ permisos: Array.from(rolPermisoIds) }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || "No se pudieron guardar los permisos")
      }
      setPermisoIdsOriginales(new Set(rolPermisoIds))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Error al guardar")
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
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
      setNewUser({ nombre: "", email: "", rol: "Usuario base", estado: "Activo" })
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo crear el usuario")
    } finally {
      setSaving(false)
    }
  }

  // -------------------- AGRUPAR CATÁLOGO POR MÓDULO --------------------
  const grupos = useMemo(() => {
    const map = new Map<string, PermisoCatalogo[]>()
    catalogo.forEach((p) => {
      if (!map.has(p.modulo)) map.set(p.modulo, [])
      map.get(p.modulo)!.push(p)
    })
    return Array.from(map.entries())
  }, [catalogo])

  // -------------------- RENDER --------------------
  return (
    <div>
      <PageTitle
        title="Gestión de Usuarios"
        sub="Usuarios, roles y permisos del sistema"
      >
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>
            <Ico p={I.plus} size={14} /> Nuevo usuario
          </button>
        )}
      </PageTitle>

      {loadError && (
        <div className="panel" style={{ padding: 20, color: "#B91C1C" }}>
          {loadError}
        </div>
      )}

      {/* ============================================== */}
      {/* TABLA DE USUARIOS (visible para Admin y Vendedor) */}
      {/* ============================================== */}
      <div className="panel">
        <table className="dt w-full">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              {isAdmin && <th></th>}
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
                      user.rol === "Superusuario / Admin"
                        ? "danger"
                        : user.rol === "Usuario con privilegios"
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
                {isAdmin && (
                  <td style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        // TODO: abrir modal de edición de usuario
                        alert(`Editar usuario: ${user.nombre}`)
                      }}
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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============================================== */}
      {/* PANEL DE ROLES Y PERMISOS — SOLO ADMIN         */}
      {/* ============================================== */}
      {isAdmin && (
        <>
          {/* Selección de rol */}
          <div className="panel usuarios-panel" style={{ marginTop: 18 }}>
            <div className="panel-header">
              <span className="usuarios-section-title">Roles y permisos</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {saveStatus === "saving" && <Badge t="warn">Guardando…</Badge>}
                {saveStatus === "saved" && <Badge t="ok">Guardado ✓</Badge>}
                {saveStatus === "error" && <Badge t="danger">Error al guardar</Badge>}
                {hasChanges && saveStatus === "idle" && (
                  <Badge t="info">Cambios sin guardar</Badge>
                )}
              </div>
            </div>

            <div className="usuarios-roles-grid" style={{ marginTop: 12 }}>
              {[1, 2, 3].map((roleId) => (
                <button
                  key={roleId}
                  onClick={() => handleRoleChange(roleId)}
                  className={`usuarios-role-card ${selectedRoleId === roleId ? "active" : "inactive"}`}
                >
                  <div className="usuarios-role-title">{ROLE_DISPLAY[roleId]}</div>
                  <div className="usuarios-role-desc">
                    {roleId === 1
                      ? "Acceso total a todos los módulos."
                      : roleId === 2
                        ? "Permisos seleccionables por módulo."
                        : "Solo lectura del sistema."}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes de permisos */}
          <div className="panel" style={{ marginTop: 18 }}>
            <div className="panel-header" style={{ marginBottom: 18 }}>
              <span className="usuarios-section-title">
                Funcionalidades y permisos del rol seleccionado
              </span>
              <Badge t="info">{ROLE_DISPLAY[selectedRoleId]}</Badge>
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              {grupos.map(([modulo, permisos]) => (
                <div
                  key={modulo}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: 16,
                    background: "#F8FAFC",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 12, color: "#0F172A" }}>
                    {NOMBRES_MODULO[modulo] ?? modulo}
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {permisos.map((permiso) => (
                      <label
                        key={permiso.id}
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
                          checked={rolPermisoIds.has(permiso.id)}
                          onChange={() => togglePermission(permiso.id)}
                        />
                        <span>{permiso.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de guardado manual */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                paddingTop: 18,
                borderTop: "1px solid #E2E8F0",
                alignItems: "center",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={guardarPermisos}
                disabled={saving || !hasChanges}
              >
                <Ico p={I.check} size={14} />{" "}
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
              {saveError && (
                <span style={{ color: "#B91C1C", fontSize: "0.75rem" }}>
                  {saveError}
                </span>
              )}
              {!hasChanges && !saving && (
                <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                  Sin cambios pendientes.
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* ============================================== */}
      {/* MODAL: Nuevo usuario (solo Admin)              */}
      {/* ============================================== */}
      {isAdmin && showNew && (
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
                  onChange={(event) =>
                    setNewUser((current) => ({ ...current, nombre: event.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Correo electrónico</label>
                <input
                  className="input"
                  type="email"
                  placeholder="usuario@ecoterra.cl"
                  value={newUser.email}
                  onChange={(event) =>
                    setNewUser((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label className="label">Rol</label>
                <select
                  className="select"
                  value={newUser.rol}
                  onChange={(event) =>
                    setNewUser((current) => ({ ...current, rol: event.target.value }))
                  }
                >
                  <option value="Superusuario / Admin">Superusuario / Admin</option>
                  <option value="Usuario con privilegios">Usuario con privilegios</option>
                  <option value="Usuario base">Usuario base</option>
                </select>
              </div>
            </div>
            {saveError && <p style={{ color: "#B91C1C", marginTop: 12 }}>{saveError}</p>}
            <div className="usuarios-form-actions">
              <button className="btn btn-primary" onClick={saveNewUser} disabled={saving}>
                <Ico p={I.check} size={14} /> Guardar
              </button>
              <button className="btn btn-ghost" onClick={() => setShowNew(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}