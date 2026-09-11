import React, { ReactNode } from "react"

export function Ico({
  p,
  size = 16,
  stroke = 1.75,
}: {
  p: string
  size?: number
  stroke?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={p} />
    </svg>
  )
}

export const I = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",

  clients:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",

  products:
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",

  lots: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

  quotes:
    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 9 5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2 M12 12h4 M12 16h4 M8 12h.01 M8 16h.01",

  invoice: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",

  alert:
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",

  ship: "M3 17l1.9-5.7A2 2 0 0 1 6.8 10H17l2-8H5.5a2 2 0 0 0-2 2 M3 17h18 M8 21a2 2 0 1 1 0-4 2 2 0 0 0 0 4z M16 21a2 2 0 1 1 0-4 2 2 0 0 0 0-4z",

  menu: "M3 12h18M3 6h18M3 18h18",

  plus: "M12 5v14M5 12h14",

  pdf: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",

  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",

  trash:
    "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",

  x: "M18 6L6 18M6 6l12 12",

  check: "M20 6L9 17l-5-5",

  search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",

  chevR: "M9 18l6-6-6-6",

  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",

  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  bar: "M3 3v18h18 M7 16V9 M11 16V5 M15 16v-5 M19 16V9",
  sparkle: "M12 3l1.88 5.28 5.62.42-4.38 3.66 1.5 5.5L12 15l-4.62 2.86 1.5-5.5L4.5 8.7l5.62-.42z",
}

export type Screen = "login" | "dashboard" | "clientes" | "proveedores" | "productos" | "lotes" | "movimientos" | "cotizaciones" | "oc" | "facturacion" | "nc" | "ia" | "usuarios"

export type Product = {
  id: number
  codigo: string
  nombre: string
  desc: string
  tipo: string
  unidad: string
  stockMin: number
  stock: number
}

export type BadgeType = "ok" | "warn" | "danger" | "info" | "neutral" | "purple"

export function Badge({ t, children }: { t: BadgeType children: ReactNode }) {
  return <span className={`badge badge-${t}`}>{children}</span>
}

export function fmt(n: number) {
  return n.toLocaleString("es-CL")
}

export function fmtCLP(n: number) {
  return `$${n.toLocaleString("es-CL")}`
}

export function PageTitle({
  title,
  sub,
  children,
}: {
  title: string
  sub?: string
  children?: ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 18,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {sub && (
          <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>
            {sub}
          </p>
        )}
      </div>
      {children && <div style={{ display: "flex", gap: 8 }}>{children}</div>}
    </div>
  )
}
