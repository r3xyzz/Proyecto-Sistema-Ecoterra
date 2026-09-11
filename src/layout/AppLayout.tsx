import React, { ReactNode, useState } from "react"

import logoEcoterra from "@/imports/logo_ecoterra.png"

import { I, Ico, Screen } from "../shared"

type NavGroup = {
  label: string
  items: { id: Screen label: string icon: string }[]
}

const NAV: NavGroup[] = [
  {
    label: "",
    items: [{ id: "dashboard", label: "Dashboard", icon: I.dashboard }],
  },

  {
    label: "Gestión Operativa",
    items: [
      { id: "clientes", label: "Clientes", icon: I.clients },
      { id: "proveedores", label: "Proveedores", icon: I.products },
      { id: "productos", label: "Productos", icon: I.products },
    ],
  },

  {
    label: "Inventario",
    items: [
      { id: "lotes", label: "Control de Lotes", icon: I.lots },
      { id: "movimientos", label: "Movimientos de Stock", icon: I.lots },
    ],
  },

  {
    label: "Ventas",
    items: [
      { id: "cotizaciones", label: "Cotizaciones", icon: I.quotes },
      { id: "oc", label: "Órdenes de Compra", icon: I.quotes },
      { id: "facturacion", label: "Facturación", icon: I.invoice },
      { id: "nc", label: "Notas de Crédito", icon: I.invoice },
    ],
  },

  {
    label: "Inteligencia Artificial",
    items: [{ id: "ia", label: "Panel Predictivo IA", icon: I.ai }],
  },

  {
    label: "Administración",
    items: [{ id: "usuarios", label: "Gestión de Usuarios", icon: I.clients }],
  },
]

function Sidebar({
  cur,
  onNav,
  collapsed,
  toggle,
}: {
  cur: Screen
  onNav: (screen: Screen) => void
  collapsed: boolean
  toggle: () => void
}) {
  return (
    <aside
      style={{
        width: collapsed ? 52 : 220,
        background: "#0F172A",
        flexShrink: 0,
        transition: "width 0.2s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 56,
          borderBottom: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              padding: 3,
            }}
          >
            <img
              src={logoEcoterra}
              alt="Ecoterra"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: 8,
                padding: "5px 10px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <img
                src={logoEcoterra}
                alt="Ecoterra"
                style={{
                  height: 22,
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>
        )}
        <button
          onClick={toggle}
          style={{
            marginLeft: collapsed ? "auto" : 0,
            color: "#475569",
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 0,
            flexShrink: 0,
          }}
        >
          <Ico p={I.menu} size={15} />
        </button>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px 16px" }}>
        {NAV.map((group, groupIndex) => (
          <div key={groupIndex}>
            {!collapsed && group.label && (
              <div className="nav-section">{group.label}</div>
            )}
            {collapsed && group.label && <div style={{ height: 10 }} />}
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${cur === item.id ? "active" : ""}`}
                onClick={() => onNav(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon">
                  <Ico p={item.icon} size={15} />
                </span>
                {!collapsed && item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>
      {!collapsed && (
        <div
          style={{
            borderTop: "1px solid #1E293B",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#0052CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "0.6875rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            JR
          </div>
          <div>
            <div
              style={{ color: "#E2E8F0", fontSize: "0.75rem", fontWeight: 600 }}
            >
              Juan Rojas
            </div>
            <div style={{ color: "#475569", fontSize: "0.6875rem" }}>
              Administrador
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

function Topbar({ screen }: { screen: Screen }) {
  const label =
    NAV.flatMap((group) => group.items).find((item) => item.id === screen)
      ?.label ?? ""

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo">
          <img src={logoEcoterra} alt="Ecoterra" />
        </div>
        <div className="topbar-context">
          <span className="topbar-company">Ecoterra</span>
          <span className="topbar-divider">/</span>
          <span className="topbar-page">{label}</span>
          <span className="topbar-date">
            {new Date().toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ position: "relative" }}
        >
          <Ico p={I.alert} size={14} />
          <span
            className="badge badge-danger"
            style={{
              padding: "1px 5px",
              fontSize: "0.625rem",
              position: "absolute",
              top: -4,
              right: -4,
            }}
          >
            3
          </span>
        </button>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#0052CC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "0.6875rem",
            fontWeight: 700,
          }}
        >
          JR
        </div>
      </div>
    </div>
  )
}

export default function AppLayout({
  screen,
  onNav,
  children,
}: {
  screen: Screen
  onNav: (screen: Screen) => void
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        background: "#F1F5F9",
      }}
    >
      <Sidebar
        cur={screen}
        onNav={onNav}
        collapsed={collapsed}
        toggle={() => setCollapsed(!collapsed)}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Topbar screen={screen} />
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
