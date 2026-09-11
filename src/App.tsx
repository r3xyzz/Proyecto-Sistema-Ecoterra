import React, { useState, ReactNode, useRef } from "react";
import logoEcoterra from "@/imports/logo_ecoterra.png";

// ─── SVG icon primitive ───────────────────────────────────────────────────────
function Ico({ p, size = 16, stroke = 1.75 }: { p: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={p} />
    </svg>
  );
}
const I = {
  dashboard:  "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  clients:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  suppliers:  "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  products:   "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  lots:       "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  moves:      "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
  quotes:     "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 9 5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2 M12 12h4 M12 16h4 M8 12h.01 M8 16h.01",
  oc:         "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  invoice:    "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  nc:         "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M9 14l2 2 4-4",
  logistics:  "M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3 M16 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M9 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  ai:         "M12 2a5 5 0 0 1 5 5v1h1a3 3 0 0 1 0 6h-1v1a5 5 0 0 1-10 0v-1H6a3 3 0 0 1 0-6h1V7a5 5 0 0 1 5-5z",
  plus:       "M12 5v14M5 12h14",
  x:          "M18 6L6 18M6 6l12 12",
  search:     "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  chevR:      "M9 18l6-6-6-6",
  chevD:      "M6 9l6 6 6-6",
  alert:      "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  check:      "M20 6L9 17l-5-5",
  edit:       "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:      "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  mail:       "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  pdf:        "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  download:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  ship:       "M3 17l1.9-5.7A2 2 0 0 1 6.8 10H17l2-8H5.5a2 2 0 0 0-2 2 M3 17h18 M8 21a2 2 0 1 1 0-4 2 2 0 0 0 0 4z M16 21a2 2 0 1 1 0-4 2 2 0 0 0 0 4z",
  warehouse:  "M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z M2 11V6l10-4 10 4v5",
  bar:        "M3 3v18h18 M7 16V9 M11 16V5 M15 16v-5 M19 16V9",
  sparkle:    "M12 3l1.88 5.28 5.62.42-4.38 3.66 1.5 5.5L12 15l-4.62 2.86 1.5-5.5L4.5 8.7l5.62-.42z",
  arrowR:     "M5 12h14M12 5l7 7-7 7",
  upload:     "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  menu:       "M3 12h18M3 6h18M3 18h18",
  user:       "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  lock:       "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
};

type Screen = "dashboard" | "clientes" | "proveedores" | "productos"
  | "lotes" | "movimientos"
  | "cotizaciones" | "oc" | "facturacion" | "nc"
  | "ia";

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Badge({ t, children }: { t: "ok"|"warn"|"danger"|"info"|"neutral"|"purple"; children: ReactNode }) {
  return <span className={`badge badge-${t}`}>{children}</span>;
}
function fmt(n: number) { return n.toLocaleString("es-CL"); }
function fmtCLP(n: number) { return `$${n.toLocaleString("es-CL")}`; }

function SwitchToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={`switch-track ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <div className="switch-thumb" />
    </div>
  );
}

function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{title}</h1>
        {sub && <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>{sub}</p>}
      </div>
      {children && <div style={{ display: "flex", gap: 8 }}>{children}</div>}
    </div>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const CLIENTES = [
  { id: 1, rut: "76.234.567-8", razon: "Minera Los Bronces S.A.", fantasia: "Los Bronces", ciudad: "Santiago", tel: "+56 2 2345 6789", email: "compras@losbronces.cl", rep: "Carlos Muñoz", estado: "Activo",
    dirs: [
      { id: 1, nombre: "Casa Matriz", calle: "Av. El Golf 40", ciudad: "Las Condes", region: "Metropolitana", pais: "Chile", cp: "7550108", tipo: "Bodega", contacto: "Ana Pérez", telDir: "+56 9 8821 3344", instrucciones: "Ingreso por portón norte. Preguntar por Ana.", principal: true },
      { id: 2, nombre: "Faena Chuquicamata", calle: "Ruta 25 s/n", ciudad: "Calama", region: "Antofagasta", pais: "Chile", cp: "1391003", tipo: "Faena", contacto: "Luis Soto", telDir: "+56 9 7711 2233", instrucciones: "Solo ingreso acreditado. Traer EPP.", principal: false },
    ]},
  { id: 2, rut: "77.891.234-5", razon: "Constructora Vial Sur Ltda.", fantasia: "Vial Sur", ciudad: "Concepción", tel: "+56 41 223 4567", email: "logistica@vialsur.cl", rep: "Ana Rodríguez", estado: "Activo",
    dirs: [
      { id: 3, nombre: "Oficina Concepción", calle: "Calle Maipú 445", ciudad: "Concepción", region: "Biobío", pais: "Chile", cp: "4070064", tipo: "Bodega", contacto: "Pedro Vega", telDir: "+56 9 6645 2233", instrucciones: "Recepción en 2do piso.", principal: true },
    ]},
  { id: 3, rut: "78.112.345-K", razon: "Agrícola Atacama SpA", fantasia: "Atacama Agro", ciudad: "Copiapó", tel: "+56 52 245 9900", email: "ops@atacamaagro.cl", rep: "Pedro Soto", estado: "Activo",
    dirs: [
      { id: 4, nombre: "Hacienda Norte", calle: "Ruta 5 Norte Km 1040", ciudad: "Copiapó", region: "Atacama", pais: "Chile", cp: "1530000", tipo: "Faena", contacto: "Rodrigo Ibáñez", telDir: "+56 9 5512 8870", instrucciones: "Acceso por portón sur. Solo camiones hasta 12 ton.", principal: true },
    ]},
  { id: 4, rut: "79.445.678-3", razon: "Caminos del Norte S.A.", fantasia: "CaminosNorte", ciudad: "Antofagasta", tel: "+56 55 224 5500", email: "adq@caminosnorte.cl", rep: "Luisa Fernández", estado: "Inactivo", dirs: [] },
  { id: 5, rut: "80.123.456-9", razon: "Portuaria del Pacífico", fantasia: "PortPacífico", ciudad: "Valparaíso", tel: "+56 32 225 1100", email: "compras@portpacifico.cl", rep: "Rodrigo Vera", estado: "Activo",
    dirs: [
      { id: 5, nombre: "Terminal Pacífico", calle: "Espigón 3, Muelle Sur", ciudad: "Valparaíso", region: "Valparaíso", pais: "Chile", cp: "2360000", tipo: "Bodega", contacto: "Marcela Lagos", telDir: "+56 9 4421 6688", instrucciones: "Coordinar previo con Marcela. Horario 08:00-17:00.", principal: true },
    ]},
];

const PRODUCTOS = [
  { id: 1, codigo: "POL-001", nombre: "EcoStab Polímero Estabilizador 500L", desc: "Estabilización de suelos y caminos no pavimentados.", tipo: "Estabilización", unidad: "Litros", stockMin: 600, stock: 2960 },
  { id: 2, codigo: "POL-002", nombre: "EcoDust Control Supresor de Polvo 25L", desc: "Supresión de polvo en caminos mineros y vías de acarreo.", tipo: "Control Polvo", unidad: "Litros", stockMin: 1000, stock: 300 },
  { id: 3, codigo: "POL-003", nombre: "EcoMine Heavy Duty 1000L", desc: "Polímero de alta resistencia para operaciones mineras.", tipo: "Minería", unidad: "Litros", stockMin: 2000, stock: 0 },
  { id: 4, codigo: "POL-004", nombre: "EcoRoad Concentrado Plus 200L", desc: "Concentrado 50X para caminos secundarios y accesos viales.", tipo: "Vialidad", unidad: "Litros", stockMin: 400, stock: 1340 },
  { id: 5, codigo: "POL-005", nombre: "EcoAgroPol Aplicación Agrícola 25L", desc: "Polímero para suelos agrícolas en zonas áridas.", tipo: "Agrícola", unidad: "Litros", stockMin: 800, stock: 200 },
];

const LOTES = [
  { id: "LT-2024-001", prod: "POL-001", batch: "B240115", qty: 1200, envase: "IBC 1000 L", fabr: "2024-01-15", venc: "2026-01-14", ubic: "A1-01", estado: "Disponible" },
  { id: "LT-2024-002", prod: "POL-001", batch: "B240320", qty: 1760, envase: "Tambor 200 L", fabr: "2024-03-20", venc: "2026-03-19", ubic: "A1-02", estado: "Disponible" },
  { id: "LT-2024-003", prod: "POL-002", batch: "B240210", qty: 300, envase: "Tambor 200 L", fabr: "2024-02-10", venc: "2025-08-09", ubic: "B2-03", estado: "Reservado" },
  { id: "LT-2024-004", prod: "POL-003", batch: "B240401", qty: 0, envase: "IBC 1000 L", fabr: "2024-04-01", venc: "2026-03-31", ubic: "A2-01", estado: "Disponible" },
  { id: "LT-2024-005", prod: "POL-004", batch: "B240512", qty: 1340, envase: "Tambor 200 L", fabr: "2024-05-12", venc: "2026-05-11", ubic: "C3-02", estado: "Disponible" },
  { id: "LT-2024-006", prod: "POL-005", batch: "B240603", qty: 200, envase: "Tambor 200 L", fabr: "2024-06-03", venc: "2025-06-02", ubic: "B3-04", estado: "Disponible" },
];

const COTIZACIONES = [
  { id: "COT-2024-041", cliente: "Minera Los Bronces S.A.", fecha: "2024-06-10", vigencia: "2024-07-10", total: 4_250_000, estado: "Vigente", oc: null as string|null, factura: null as string|null },
  { id: "COT-2024-040", cliente: "Constructora Vial Sur Ltda.", fecha: "2024-06-05", vigencia: "2024-07-05", total: 1_840_000, estado: "Convertida", oc: "OC-2024-040", factura: "FAC-2024-121" },
  { id: "COT-2024-039", cliente: "Portuaria del Pacífico", fecha: "2024-05-28", vigencia: "2024-06-28", total: 7_680_000, estado: "Vencida", oc: null, factura: null },
  { id: "COT-2024-038", cliente: "Agrícola Atacama SpA", fecha: "2024-05-20", vigencia: "2024-06-20", total: 570_000, estado: "Vigente", oc: "OC-2024-038", factura: null },
];

const FACTURAS = [
  { id: "FAC-2024-122", oc: "OC-2024-041", cliente: "Minera Los Bronces S.A.", fecha: "2024-06-12", venc: "2024-07-12", subtotal: 3_571_429, iva: 678_571, total: 4_250_000, estado: "Pendiente" },
  { id: "FAC-2024-121", oc: "OC-2024-040", cliente: "Constructora Vial Sur Ltda.", fecha: "2024-06-06", venc: "2024-07-06", subtotal: 1_546_218, iva: 293_782, total: 1_840_000, estado: "Pagada" },
  { id: "FAC-2024-120", oc: "OC-2024-039", cliente: "Portuaria del Pacífico", fecha: "2024-05-30", venc: "2024-06-30", subtotal: 6_453_782, iva: 1_226_218, total: 7_680_000, estado: "Vencida" },
];

const EMBARQUES = [
  { id: "EMB-2024-012", origen: "Corpus Christi, TX", naviera: "MSC", tipo: "IBC 1000 L", producto: "POL-003", qty: 8000, etd: "2024-06-01", eta: "2024-07-10", destino: "San Antonio", estado: "En tránsito", progreso: 65 },
  { id: "EMB-2024-011", origen: "Los Angeles, CA", naviera: "Hapag-Lloyd", tipo: "Tambor 200 L", producto: "POL-002", qty: 4000, etd: "2024-05-15", eta: "2024-06-25", destino: "Valparaíso", estado: "Llegando", progreso: 92 },
  { id: "EMB-2024-010", origen: "Miami, FL", naviera: "Evergreen", tipo: "IBC 1000 L", producto: "POL-001", qty: 12000, etd: "2024-04-20", eta: "2024-06-02", destino: "Valparaíso", estado: "Recibido", progreso: 100 },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
type NavGroup = { label: string; items: { id: Screen; label: string; icon: string }[] };
const NAV: NavGroup[] = [
  { label: "", items: [{ id: "dashboard", label: "Dashboard", icon: I.dashboard }] },
  { label: "Gestión Operativa", items: [
    { id: "clientes", label: "Clientes", icon: I.clients },
    { id: "proveedores", label: "Proveedores", icon: I.suppliers },
    { id: "productos", label: "Productos", icon: I.products },
  ]},
  { label: "Inventario", items: [
    { id: "lotes", label: "Control de Lotes", icon: I.lots },
    { id: "movimientos", label: "Movimientos de Stock", icon: I.moves },
  ]},
  { label: "Ventas", items: [
    { id: "cotizaciones", label: "Cotizaciones", icon: I.quotes },
    { id: "oc", label: "Órdenes de Compra", icon: I.oc },
    { id: "facturacion", label: "Facturación", icon: I.invoice },
    { id: "nc", label: "Notas de Crédito", icon: I.nc },
  ]},
  { label: "Inteligencia Artificial", items: [
    { id: "ia", label: "Panel Predictivo IA", icon: I.ai },
  ]},
];

function Sidebar({ cur, onNav, collapsed, toggle }: { cur: Screen; onNav: (s: Screen) => void; collapsed: boolean; toggle: () => void }) {
  return (
    <aside style={{ width: collapsed ? 52 : 220, background: "#0F172A", flexShrink: 0, transition: "width 0.2s ease", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ height: 56, borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", padding: "0 12px", gap: 8, flexShrink: 0 }}>
        {collapsed ? (
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", padding: 3 }}>
            <img src={logoEcoterra} alt="Ecoterra" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        ) : (
          <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
            <div style={{ background: "white", borderRadius: 8, padding: "5px 10px", display: "inline-flex", alignItems: "center" }}>
              <img src={logoEcoterra} alt="Ecoterra" style={{ height: 22, width: "auto", objectFit: "contain", display: "block" }} />
            </div>
          </div>
        )}
        <button onClick={toggle} style={{ marginLeft: collapsed ? "auto" : 0, color: "#475569", background: "none", border: "none", cursor: "pointer", lineHeight: 0, flexShrink: 0 }}>
          <Ico p={I.menu} size={15} />
        </button>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px 16px" }}>
        {NAV.map((group, gi) => (
          <div key={gi}>
            {!collapsed && group.label && (
              <div className="nav-section">{group.label}</div>
            )}
            {collapsed && group.label && <div style={{ height: 10 }} />}
            {group.items.map(item => (
              <div key={item.id} className={`nav-item ${cur === item.id ? "active" : ""}`} onClick={() => onNav(item.id)} title={collapsed ? item.label : undefined}>
                <span className="nav-icon"><Ico p={item.icon} size={15} /></span>
                {!collapsed && item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>
      {!collapsed && (
        <div style={{ borderTop: "1px solid #1E293B", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0052CC", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.6875rem", fontWeight: 700, flexShrink: 0 }}>JR</div>
          <div>
            <div style={{ color: "#E2E8F0", fontSize: "0.75rem", fontWeight: 600 }}>Juan Rojas</div>
            <div style={{ color: "#475569", fontSize: "0.6875rem" }}>Administrador</div>
          </div>
        </div>
      )}
    </aside>
  );
}

function Topbar({ screen }: { screen: Screen }) {
  const label = NAV.flatMap(g => g.items).find(i => i.id === screen)?.label ?? "";
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
          <span className="topbar-date">{new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-ghost btn-sm" style={{ position: "relative" }}>
          <Ico p={I.alert} size={14} />
          <span className="badge badge-danger" style={{ padding: "1px 5px", fontSize: "0.625rem", position: "absolute", top: -4, right: -4 }}>3</span>
        </button>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0052CC", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.6875rem", fontWeight: 700 }}>JR</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ onNav }: { onNav: (s: Screen) => void }) {
  const stockAlerts = PRODUCTOS.filter(p => p.stock < p.stockMin);

  const activity = [
    { time: "09:14", desc: "Cotización COT-2024-041 emitida — Minera Los Bronces S.A.", type: "quote" },
    { time: "07:30", desc: "Alerta IA: POL-002 cruzó umbral mínimo de stock. 300 L restantes.", type: "alert" },
    { time: "Ayer",  desc: "Factura FAC-2024-122 emitida · $4.250.000 CLP · Vence 12 Jul.", type: "invoice" },
    { time: "Ayer",  desc: "Lote LT-2024-005 registrado · 1.340 L POL-004 · Ubicación C3-02.", type: "lot" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PageTitle title="Dashboard" sub="Métricas operativas y alertas IA · Actualizado hace 4 min" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        <div className="kpi"><div className="kpi-label">Cotizaciones vigentes</div><div className="kpi-value tabular">6</div><div className="kpi-sub">$12,4M CLP en cartera</div></div>
        <div className="kpi"><div className="kpi-label">Facturas pendientes</div><div className="kpi-value tabular" style={{ color: "#B45309" }}>3</div><div className="kpi-sub">$10,09M CLP por cobrar</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        <div className="panel">
          <div className="panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#DC2626" }}><Ico p={I.alert} size={15} /></span>
              <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0F172A" }}>Alertas IA · Stockout</span>
              <Badge t="danger">{stockAlerts.length}</Badge>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("ia")}>Ver panel IA →</button>
          </div>
          {stockAlerts.map(p => {
            const pct = Math.min(100, (p.stock / p.stockMin) * 100);
            return (
              <div key={p.id} style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#0F172A", marginBottom: 2 }}>{p.nombre}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: 8 }}>{p.codigo} · Mínimo: {fmt(p.stockMin)} L</div>
                  <div className="progress" style={{ width: 200 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: p.stock === 0 ? "#DC2626" : "#D97706" }} />
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "#94A3B8", marginTop: 4 }}>
                    <span className="tabular" style={{ color: p.stock === 0 ? "#DC2626" : "#B45309", fontWeight: 700 }}>{fmt(p.stock)} L</span> disponibles
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <Badge t={p.stock === 0 ? "danger" : "warn"}>{p.stock === 0 ? "Sin stock" : "Bajo mínimo"}</Badge>
                  <div style={{ marginTop: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => onNav("ia")}>Consultar IA</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel">
          <div className="panel-header">
            <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0F172A" }}>Stock actual por producto</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("productos")}>Ver catálogo →</button>
          </div>
          {PRODUCTOS.map(p => {
            const pct = p.stockMin === 0 ? 100 : Math.min(100, (p.stock / p.stockMin) * 100);
            const color = p.stock === 0 ? "#DC2626" : pct < 50 ? "#D97706" : "#00995A";
            return (
              <div key={p.id} style={{ padding: "12px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nombre}</div>
                  <div className="progress" style={{ marginTop: 7 }}><div className="progress-fill" style={{ width: `${pct}%`, background: color }} /></div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="tabular" style={{ fontSize: "0.8125rem", fontWeight: 700, color }}>{fmt(p.stock)} L</div>
                  <div style={{ fontSize: "0.6875rem", color: "#94A3B8" }}>mín. {fmt(p.stockMin)} L</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="panel">
        <div className="panel-header">
          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0F172A" }}>Actividad reciente</span>
        </div>
        {activity.map((a, i) => (
          <div key={i} style={{ padding: "10px 18px", borderBottom: i < activity.length-1 ? "1px solid #F1F5F9" : "none", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: a.type === "alert" ? "#FEE2E2" : a.type === "invoice" ? "#DCFCE7" : a.type === "ship" ? "#DBEAFE" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ico p={a.type === "alert" ? I.alert : a.type === "invoice" ? I.invoice : a.type === "ship" ? I.ship : a.type === "quote" ? I.quotes : I.lots} size={13} />
            </div>
            <p style={{ flex: 1, fontSize: "0.8125rem", color: "#1E293B" }}>{a.desc}</p>
            <span style={{ fontSize: "0.6875rem", color: "#94A3B8", flexShrink: 0, fontFamily: "JetBrains Mono, monospace" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENTES ─────────────────────────────────────────────────────────────────
type Cliente = typeof CLIENTES[0];
type Direccion = typeof CLIENTES[0]["dirs"][0];

function ClientePanel({ cliente, onClose }: { cliente: Cliente; onClose: () => void }) {
  const [tab, setTab] = useState<"info"|"dirs">("info");
  const [dirs, setDirs] = useState<Direccion[]>(cliente.dirs);
  const [showDirForm, setShowDirForm] = useState(false);
  const [newDir, setNewDir] = useState<Partial<Direccion>>({ pais: "Chile", tipo: "Bodega", principal: false });

  const addDir = () => {
    if (!newDir.nombre) return;
    setDirs([...dirs, { ...newDir, id: Date.now() } as Direccion]);
    setShowDirForm(false);
    setNewDir({ pais: "Chile", tipo: "Bodega", principal: false });
  };

  return (
    <>
      <div className="slideover-backdrop" onClick={onClose} />
      <div className="slideover">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6875rem", color: "#64748B" }}>{cliente.rut}</span>
                <Badge t={cliente.estado === "Activo" ? "ok" : "neutral"}>{cliente.estado}</Badge>
              </div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>{cliente.razon}</h2>
              <p style={{ fontSize: "0.75rem", color: "#64748B" }}>{cliente.fantasia} · {cliente.ciudad}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><Ico p={I.x} size={18} /></button>
          </div>
          <div style={{ display: "flex", marginTop: 14, borderBottom: "1px solid #E2E8F0" }}>
            {(["info","dirs"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", border: "none", background: "none", borderBottom: `2px solid ${tab===t ? "#00995A" : "transparent"}`, color: tab===t ? "#00995A" : "#64748B" }}>
                {t === "info" ? "Datos del Cliente" : `Direcciones (${dirs.length})`}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "info" && (
            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { k: "rut", l: "RUT", span: 1, val: cliente.rut },
                { k: "estado", l: "Estado", span: 1, val: cliente.estado, type: "select" },
                { k: "razon", l: "Razón Social", span: 2, val: cliente.razon },
                { k: "fantasia", l: "Nombre de Fantasía", span: 1, val: cliente.fantasia },
                { k: "ciudad", l: "Ciudad", span: 1, val: cliente.ciudad },
                { k: "tel", l: "Teléfono", span: 1, val: cliente.tel },
                { k: "email", l: "Correo Electrónico", span: 2, val: cliente.email },
                { k: "rep", l: "Representante", span: 1, val: cliente.rep },
              ].map(f => (
                <div key={f.k} className="field" style={{ gridColumn: `span ${f.span}` }}>
                  <label className="label">{f.l}</label>
                  {f.type === "select" ? (
                    <select className="select" defaultValue={f.val}><option>Activo</option><option>Inactivo</option></select>
                  ) : (
                    <input className="input" defaultValue={f.val} />
                  )}
                </div>
              ))}
              <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}><Ico p={I.check} size={14} /> Guardar cambios</button>
                <button className="btn btn-ghost"><Ico p={I.trash} size={14} /></button>
              </div>
            </div>
          )}
          {tab === "dirs" && (
            <div style={{ padding: "16px 20px" }}>
              {dirs.map((d, i) => (
                <div key={d.id} style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: 14, marginBottom: 10, background: d.principal ? "#F0FDF4" : "white" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0F172A" }}>{d.nombre}</span>
                      <Badge t={d.tipo === "Faena" ? "warn" : "info"}>{d.tipo}</Badge>
                      {d.principal && <Badge t="ok">Principal</Badge>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Principal</span>
                      <SwitchToggle on={d.principal} onChange={v => setDirs(dirs.map((x,j) => j===i ? {...x,principal:v} : {...x,principal: v ? false : x.principal}))} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", fontSize: "0.75rem", color: "#475569" }}>
                    <div><span style={{ color: "#94A3B8" }}>Calle:</span> {d.calle}</div>
                    <div><span style={{ color: "#94A3B8" }}>Ciudad:</span> {d.ciudad}, {d.region}</div>
                    <div><span style={{ color: "#94A3B8" }}>País:</span> {d.pais}</div>
                    <div><span style={{ color: "#94A3B8" }}>CP:</span> {d.cp}</div>
                    <div><span style={{ color: "#94A3B8" }}>Contacto:</span> {d.contacto}</div>
                    <div><span style={{ color: "#94A3B8" }}>Tel:</span> {d.telDir}</div>
                    {d.instrucciones && <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#94A3B8" }}>Instrucciones:</span> {d.instrucciones}</div>}
                  </div>
                </div>
              ))}
              {showDirForm && (
                <div style={{ border: "1px dashed #00995A", borderRadius: 8, padding: 16, background: "#F0FDF4", marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#166534", marginBottom: 12 }}>Nueva dirección</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { k:"nombre", l:"Nombre", span:2 }, { k:"calle", l:"Calle / Dirección", span:2 },
                      { k:"ciudad", l:"Ciudad", span:1 }, { k:"region", l:"Región", span:1 },
                      { k:"pais", l:"País", span:1 }, { k:"cp", l:"Cód. Postal", span:1 },
                      { k:"contacto", l:"Contacto Recepción", span:1 }, { k:"telDir", l:"Teléfono", span:1 },
                    ].map(f => (
                      <div key={f.k} className="field" style={{ gridColumn: `span ${f.span}` }}>
                        <label className="label">{f.l}</label>
                        <input className="input" value={(newDir as any)[f.k]||""} onChange={e => setNewDir({...newDir,[f.k]:e.target.value})} />
                      </div>
                    ))}
                    <div className="field">
                      <label className="label">Tipo</label>
                      <select className="select" value={newDir.tipo} onChange={e => setNewDir({...newDir,tipo:e.target.value})}>
                        <option>Faena</option><option>Bodega</option><option>Oficina</option><option>Puerto</option><option>Otro</option>
                      </select>
                    </div>
                    <div className="field" style={{ gridColumn:"1/-1" }}>
                      <label className="label">Instrucciones de entrega</label>
                      <textarea className="textarea" value={newDir.instrucciones||""} onChange={e => setNewDir({...newDir,instrucciones:e.target.value})} />
                    </div>
                    <div style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:"0.8125rem", color:"#475569" }}>Dirección Principal</span>
                      <SwitchToggle on={newDir.principal??false} onChange={v => setNewDir({...newDir,principal:v})} />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:12 }}>
                    <button className="btn btn-primary btn-sm" onClick={addDir}><Ico p={I.check} size={13} /> Agregar</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowDirForm(false)}>Cancelar</button>
                  </div>
                </div>
              )}
              {!showDirForm && (
                <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"center", borderStyle:"dashed" }} onClick={() => setShowDirForm(true)}>
                  <Ico p={I.plus} size={14} /> Agregar dirección
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Clientes() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Cliente|null>(null);
  const [showNew, setShowNew] = useState(false);
  const filtered = CLIENTES.filter(c => c.razon.toLowerCase().includes(search.toLowerCase()) || c.rut.includes(search));

  return (
    <div>
      <PageTitle title="Gestión de Clientes" sub="Clientes y sus múltiples direcciones de entrega">
        <button className="btn btn-primary" onClick={() => setShowNew(true)}><Ico p={I.plus} size={14} /> Nuevo cliente</button>
      </PageTitle>
      <div className="panel">
        <div className="panel-header">
          <div style={{ position:"relative", width:280 }}>
            <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:"#94A3B8" }}><Ico p={I.search} size={14} /></span>
            <input className="input" style={{ paddingLeft:30 }} placeholder="Buscar por razón social o RUT…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize:"0.75rem", color:"#94A3B8" }}>{filtered.length} clientes</span>
        </div>
        <table className="dt w-full">
          <thead><tr><th>RUT</th><th>Razón Social</th><th>Ciudad</th><th>Representante</th><th>Teléfono</th><th>Dirs.</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ cursor:"pointer" }} onClick={() => setSelected(c)}>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{c.rut}</td>
                <td><div style={{ fontWeight:600, color:"#0F172A" }}>{c.razon}</div><div style={{ fontSize:"0.6875rem", color:"#94A3B8" }}>{c.fantasia}</div></td>
                <td style={{ color:"#475569" }}>{c.ciudad}</td>
                <td style={{ color:"#475569" }}>{c.rep}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#475569" }}>{c.tel}</td>
                <td style={{ textAlign:"center" }}><Badge t={c.dirs.length>0?"info":"neutral"}>{c.dirs.length}</Badge></td>
                <td><Badge t={c.estado==="Activo"?"ok":"neutral"}>{c.estado}</Badge></td>
                <td><button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();setSelected(c);}}>Ver detalles <Ico p={I.chevR} size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <ClientePanel cliente={selected} onClose={() => setSelected(null)} />}
      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div className="modal" style={{ width:540, padding:24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
              <h2 style={{ fontWeight:700, color:"#0F172A" }}>Nuevo Cliente</h2>
              <button onClick={() => setShowNew(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18} /></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[{l:"RUT",s:1},{l:"Razón Social",s:2},{l:"Nombre de Fantasía",s:1},{l:"Ciudad",s:1},{l:"Teléfono",s:1},{l:"Correo Electrónico",s:2},{l:"Representante",s:1}].map(f => (
                <div key={f.l} className="field" style={{ gridColumn:`span ${f.s}` }}>
                  <label className="label">{f.l}</label>
                  <input className="input" placeholder={f.l} />
                </div>
              ))}
              <div className="field"><label className="label">Estado</label><select className="select"><option>Activo</option><option>Inactivo</option></select></div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:18 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }} onClick={() => setShowNew(false)}><Ico p={I.check} size={14} /> Guardar</button>
              <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROVEEDORES ──────────────────────────────────────────────────────────────
const PROVEEDORES_DATA = [
  { id:1, nombre:"Polymer Solutions Inc.", pais:"EE.UU.", contacto:"John Williams", email:"jwilliams@polysol.com", tel:"+1 713 445 8821", leadTime:"35–42 días", estado:"Activo" },
  { id:2, nombre:"ChemTrade Global LLC", pais:"EE.UU.", contacto:"Sarah Connor", email:"sconnor@chemtrade.com", tel:"+1 832 221 9043", leadTime:"28–35 días", estado:"Activo" },
  { id:3, nombre:"Pacific Polymers Corp.", pais:"EE.UU.", contacto:"David Park", email:"dpark@pacpoly.com", tel:"+1 206 882 7711", leadTime:"40–50 días", estado:"Activo" },
  { id:4, nombre:"EcoQuímicos Brasil", pais:"Brasil", contacto:"Felipe Alves", email:"falves@ecobr.com", tel:"+55 11 3344 8899", leadTime:"15–20 días", estado:"Inactivo" },
];
function Proveedores() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <PageTitle title="Proveedores" sub="Directorio de proveedores de materias primas">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Ico p={I.plus} size={14} /> Nuevo proveedor</button>
      </PageTitle>
      <div className="panel">
        <table className="dt w-full">
          <thead><tr><th>Empresa</th><th>País</th><th>Contacto</th><th>Email</th><th>Lead Time</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {PROVEEDORES_DATA.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{p.nombre}</td>
                <td><Badge t="info">{p.pais}</Badge></td>
                <td><div>{p.contacto}</div><div style={{ fontSize:"0.6875rem", color:"#94A3B8" }}>{p.tel}</div></td>
                <td style={{ color:"#0052CC", fontSize:"0.8125rem" }}>{p.email}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#0052CC", fontWeight:600 }}>{p.leadTime}</td>
                <td><Badge t={p.estado==="Activo"?"ok":"neutral"}>{p.estado}</Badge></td>
                <td><div style={{ display:"flex", gap:4 }}><button className="btn btn-ghost btn-sm"><Ico p={I.edit} size={13} /></button><button className="btn btn-ghost btn-sm"><Ico p={I.trash} size={13} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width:480, padding:24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
              <h2 style={{ fontWeight:700, color:"#0F172A" }}>Nuevo Proveedor</h2>
              <button onClick={() => setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18} /></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[{l:"Nombre Empresa",s:2},{l:"País",s:1},{l:"Lead Time (días)",s:1},{l:"Contacto",s:1},{l:"Teléfono",s:1},{l:"Email",s:2}].map(f=>(
                <div key={f.l} className="field" style={{ gridColumn:`span ${f.s}` }}><label className="label">{f.l}</label><input className="input" placeholder={f.l}/></div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:18 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }} onClick={() => setShowModal(false)}><Ico p={I.check} size={14} /> Guardar</button>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────
function Productos() {
  return (
    <div>
      <PageTitle title="Catálogo de Productos" sub="Polímeros industriales Ecoterra">
        <button className="btn btn-primary"><Ico p={I.plus} size={14} /> Nuevo producto</button>
      </PageTitle>
      <div className="panel">
        <table className="dt w-full">
          <thead><tr><th>Código</th><th>Nombre</th><th>Tipo</th><th>Unidad</th><th>Stock Mínimo</th><th>Stock Actual</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {PRODUCTOS.map(p => {
              const pct = p.stockMin===0 ? 100 : (p.stock/p.stockMin)*100;
              const st = p.stock===0 ? "danger" : pct<50 ? "warn" : "ok";
              return (
                <tr key={p.id}>
                  <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", fontWeight:700, color:"#0052CC" }}>{p.codigo}</td>
                  <td><div style={{ fontWeight:600, color:"#0F172A" }}>{p.nombre}</div><div style={{ fontSize:"0.6875rem", color:"#94A3B8" }}>{p.desc}</div></td>
                  <td><Badge t="info">{p.tipo}</Badge></td>
                  <td style={{ color:"#475569" }}>{p.unidad}</td>
                  <td style={{ fontFamily:"JetBrains Mono, monospace" }}>{fmt(p.stockMin)} L</td>
                  <td>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      <span className="tabular" style={{ fontWeight:700, color: p.stock===0?"#DC2626":pct<50?"#B45309":"#15803D" }}>{fmt(p.stock)} L</span>
                      <div className="progress" style={{ width:80 }}><div className="progress-fill" style={{ width:`${Math.min(100,pct)}%`, background: p.stock===0?"#DC2626":pct<50?"#D97706":"#00995A" }}/></div>
                    </div>
                  </td>
                  <td><Badge t={st as any}>{p.stock===0?"Sin stock":pct<50?"Bajo mínimo":"OK"}</Badge></td>
                  <td><div style={{ display:"flex", gap:4 }}><button className="btn btn-ghost btn-sm"><Ico p={I.edit} size={13}/></button><button className="btn btn-ghost btn-sm"><Ico p={I.trash} size={13}/></button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── LOTES ────────────────────────────────────────────────────────────────────
function Lotes() {
  const [fEnvase, setFEnvase] = useState("");
  const [fEstado, setFEstado] = useState("");
  const filtered = LOTES.filter(l => (!fEnvase||l.envase===fEnvase)&&(!fEstado||l.estado===fEstado));
  const expiringSoon = (d: string) => { const ms = new Date(d).getTime()-Date.now(); return ms>0&&ms<1000*60*60*24*180; };

  return (
    <div>
      <PageTitle title="Control de Lotes" sub="Trazabilidad de inventario físico por lote">
        <button className="btn btn-primary"><Ico p={I.plus} size={14} /> Registrar lote</button>
      </PageTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
        <div className="kpi"><div className="kpi-label">Lotes activos</div><div className="kpi-value tabular">{LOTES.filter(l=>l.qty>0).length}</div></div>
        <div className="kpi"><div className="kpi-label">Litros en bodega</div><div className="kpi-value tabular">{fmt(LOTES.reduce((s,l)=>s+l.qty,0))} L</div></div>
        <div className="kpi"><div className="kpi-label">Sin stock</div><div className="kpi-value tabular" style={{ color:"#DC2626" }}>{LOTES.filter(l=>l.qty===0).length}</div></div>
        <div className="kpi"><div className="kpi-label">Próx. a vencer</div><div className="kpi-value tabular" style={{ color:"#B45309" }}>{LOTES.filter(l=>expiringSoon(l.venc)).length}</div></div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <div style={{ display:"flex", gap:8 }}>
            <select className="select" style={{ width:180 }} value={fEnvase} onChange={e=>setFEnvase(e.target.value)}>
              <option value="">Todos los envases</option><option>Tambor 200 L</option><option>IBC 1000 L</option>
            </select>
            <select className="select" style={{ width:160 }} value={fEstado} onChange={e=>setFEstado(e.target.value)}>
              <option value="">Todos los estados</option><option>Disponible</option><option>Reservado</option>
            </select>
          </div>
          <span style={{ fontSize:"0.75rem", color:"#94A3B8" }}>{filtered.length} lotes</span>
        </div>
        <table className="dt w-full">
          <thead><tr><th>ID Lote</th><th>Batch</th><th>Producto</th><th>Cantidad</th><th>Envase</th><th>Fabricación</th><th>Vencimiento</th><th>Ubicación</th><th>Estado</th></tr></thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", fontWeight:700, color:"#0052CC" }}>{l.id}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", color:"#64748B" }}>{l.batch}</td>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{l.prod}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, color:l.qty===0?"#DC2626":"#0F172A" }}>{fmt(l.qty)} L</td>
                <td><Badge t="neutral">{l.envase}</Badge></td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{l.fabr}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:expiringSoon(l.venc)?"#B45309":"#475569", fontWeight:expiringSoon(l.venc)?700:400 }}>{expiringSoon(l.venc)&&"⚠ "}{l.venc}</td>
                <td><code style={{ background:"#F1F5F9", padding:"2px 6px", borderRadius:4, fontSize:"0.75rem" }}>{l.ubic}</code></td>
                <td><Badge t={l.estado==="Disponible"?"ok":"warn"}>{l.estado}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MOVIMIENTOS ──────────────────────────────────────────────────────────────
function Movimientos() {
  const [type, setType] = useState<"Entrada"|"Salida"|"Ajuste">("Entrada");
  const [prod, setProd] = useState("");
  const [qty, setQty] = useState("");
  const [done, setDone] = useState(false);
  const history = [
    { id:"MOV-00314", ts:"2024-06-13 09:22", tipo:"Entrada", prod:"POL-001", qty:1200, batch:"LT-2024-002", user:"Juan Rojas", ref:"EMB-2024-010" },
    { id:"MOV-00313", ts:"2024-06-12 14:35", tipo:"Salida", prod:"POL-002", qty:-320, batch:"LT-2024-003", user:"María López", ref:"OC-2024-040" },
    { id:"MOV-00312", ts:"2024-06-11 10:00", tipo:"Ajuste", prod:"POL-005", qty:-40, batch:"LT-2024-006", user:"Pedro García", ref:"Conteo físico Jun/24" },
    { id:"MOV-00311", ts:"2024-06-10 16:50", tipo:"Salida", prod:"POL-004", qty:-200, batch:"LT-2024-005", user:"Juan Rojas", ref:"FAC-2024-121" },
  ];
  const tc: Record<string,string> = { Entrada:"#00995A", Salida:"#DC2626", Ajuste:"#D97706" };

  return (
    <div>
      <PageTitle title="Movimientos de Stock" sub="Registro de entradas, salidas y ajustes" />
      <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:16 }}>
        <div className="panel" style={{ padding:20 }}>
          <div style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A", marginBottom:16 }}>Registrar Movimiento</div>
          {done ? (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}><Ico p={I.check} size={26} /></div>
              <p style={{ fontWeight:700, color:"#15803D" }}>Movimiento registrado</p>
              <p style={{ fontSize:"0.75rem", color:"#64748B", marginTop:4 }}>MOV-00315 · {new Date().toLocaleString("es-CL")}</p>
              <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => { setDone(false); setProd(""); setQty(""); }}>Nuevo registro</button>
            </div>
          ) : (
            <>
              <div style={{ display:"flex", borderRadius:8, border:"1px solid #E2E8F0", overflow:"hidden", marginBottom:16 }}>
                {(["Entrada","Salida","Ajuste"] as const).map(t => (
                  <button key={t} style={{ flex:1, padding:"8px 0", fontSize:"0.8125rem", fontWeight:700, cursor:"pointer", border:"none", background:type===t?tc[t]:"transparent", color:type===t?"white":"#94A3B8", transition:"all 0.15s" }} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div className="field"><label className="label">Producto *</label>
                  <select className="select" value={prod} onChange={e => setProd(e.target.value)}>
                    <option value="">Seleccionar…</option>
                    {PRODUCTOS.map(p => <option key={p.id} value={p.codigo}>{p.codigo} · {p.nombre}</option>)}
                  </select>
                </div>
                <div className="field"><label className="label">Lote</label>
                  <select className="select" disabled={!prod}>
                    <option>Seleccionar lote…</option>
                    {LOTES.filter(l=>l.prod===prod).map(l => <option key={l.id} value={l.id}>{l.id} · {l.ubic} · {fmt(l.qty)} L</option>)}
                  </select>
                </div>
                <div className="field"><label className="label">Cantidad (litros) *</label>
                  <input className="input" type="number" min={1} value={qty} onChange={e => setQty(e.target.value)} placeholder="0" />
                </div>
                {type==="Ajuste" && (
                  <div className="field"><label className="label">Motivo *</label>
                    <select className="select"><option>Conteo físico</option><option>Merma</option><option>Daño en bodega</option><option>Devolución</option></select>
                  </div>
                )}
                <div className="field"><label className="label">Referencia (OC, Factura, Embarque…)</label>
                  <input className="input" placeholder="Ej: OC-2024-041" />
                </div>
                <div className="field"><label className="label">Usuario responsable</label>
                  <select className="select"><option>Juan Rojas</option><option>María López</option><option>Pedro García</option></select>
                </div>
                <button className="btn btn-primary" style={{ justifyContent:"center" }} onClick={() => { if(prod&&qty)setDone(true); }} disabled={!prod||!qty}>
                  <Ico p={I.check} size={14} /> Confirmar {type}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="panel">
          <div className="panel-header">
            <span style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A" }}>Historial de Movimientos</span>
            <button className="btn btn-ghost btn-sm"><Ico p={I.download} size={13} /> Exportar</button>
          </div>
          <table className="dt w-full">
            <thead><tr><th>ID</th><th>Fecha / Hora</th><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Lote</th><th>Referencia</th><th>Usuario</th></tr></thead>
            <tbody>
              {history.map(m => (
                <tr key={m.id}>
                  <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", fontWeight:700, color:"#0052CC" }}>{m.id}</td>
                  <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", color:"#64748B" }}>{m.ts}</td>
                  <td><Badge t={m.tipo==="Entrada"?"ok":m.tipo==="Salida"?"danger":"warn"}>{m.tipo}</Badge></td>
                  <td style={{ fontWeight:600, color:"#0F172A" }}>{m.prod}</td>
                  <td style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, color:m.qty<0?"#DC2626":"#15803D" }}>{m.qty>0?"+":""}{fmt(m.qty)} L</td>
                  <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", color:"#64748B" }}>{m.batch}</td>
                  <td style={{ fontSize:"0.75rem", color:"#0052CC" }}>{m.ref}</td>
                  <td style={{ fontSize:"0.75rem", color:"#475569" }}>{m.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── COTIZACIONES ─────────────────────────────────────────────────────────────
const PRECIOS: Record<number,number> = { 1:285000, 2:42500, 3:980000, 4:310000, 5:38000 };
type QuoteItem = { prodId:number; qty:number; precio:number };

function CreadorCotizacion({ onClose }: { onClose: () => void }) {
  const [clienteId, setClienteId] = useState<number|null>(null);
  const [items, setItems] = useState<QuoteItem[]>([{ prodId:0, qty:1, precio:0 }]);
  const [showAi, setShowAi] = useState(false);
  const [aiProd, setAiProd] = useState<typeof PRODUCTOS[0]|null>(null);

  const cliente = CLIENTES.find(c => c.id===clienteId);
  const subtotal = items.reduce((s,i)=>s+i.qty*i.precio,0);
  const iva = Math.round(subtotal*0.19);

  const setItem = (idx:number, field:keyof QuoteItem, val:number) => {
    setItems(items.map((it,i) => {
      if(i!==idx) return it;
      const next = {...it,[field]:val};
      if(field==="prodId"&&val>0) next.precio = PRECIOS[val]??0;
      return next;
    }));
  };

  const stockAlert = (item:QuoteItem) => {
    if(!item.prodId) return null;
    const p = PRODUCTOS.find(p=>p.id===item.prodId);
    if(!p) return null;
    if(p.stock===0) return { type:"critical", prod:p };
    if(p.stock<p.stockMin) return { type:"low", prod:p };
    return null;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width:780, padding:0 }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h2 style={{ fontWeight:700, color:"#0F172A", fontSize:"1rem" }}>Nueva Cotización</h2>
            <p style={{ fontSize:"0.6875rem", color:"#94A3B8", fontFamily:"JetBrains Mono, monospace" }}>COT-2024-042 · Borrador</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18} /></button>
        </div>
        <div style={{ padding:"20px 24px", overflowY:"auto", maxHeight:"calc(90vh - 200px)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            <div className="field" style={{ gridColumn:"span 2" }}>
              <label className="label">Cliente *</label>
              <select className="select" value={clienteId??""} onChange={e=>{setClienteId(Number(e.target.value));}}>
                <option value="">Seleccionar cliente…</option>
                {CLIENTES.map(c=><option key={c.id} value={c.id}>{c.razon}</option>)}
              </select>
            </div>
            <div className="field" style={{ gridColumn:"span 2" }}>
              <label className="label">Dirección de despacho *</label>
              <select className="select" disabled={!cliente}>
                <option value="">Seleccionar dirección…</option>
                {cliente?.dirs.map(d=><option key={d.id} value={d.id}>{d.nombre} — {d.ciudad}{d.principal?" ★":""}</option>)}
              </select>
            </div>
            <div className="field"><label className="label">Fecha</label><input type="date" className="input" defaultValue="2024-06-14"/></div>
            <div className="field"><label className="label">Vigencia</label><select className="select"><option>7 días</option><option>10 días</option><option>15 días</option><option>30 días</option></select></div>
            <div className="field"><label className="label">Condición de pago</label><select className="select"><option>Contado</option><option>50% Contado - 50% Contraentrega</option><option>30 Días</option></select></div>
            <div className="field"><label className="label">Moneda</label><select className="select"><option>CLP</option><option>USD</option></select></div>
          </div>

          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontWeight:700, fontSize:"0.8125rem", color:"#0F172A" }}>Productos / Servicios</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setItems([...items,{prodId:0,qty:1,precio:0}])}><Ico p={I.plus} size={13} /> Agregar línea</button>
            </div>
            <div style={{ border:"1px solid #E2E8F0", borderRadius:8, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#F8FAFC" }}>
                    {["Producto","Cant.","P. Unit. (CLP)","Subtotal",""].map((h,i) => (
                      <th key={i} style={{ padding:"8px 12px", textAlign:i>0?"right":"left", fontSize:"0.6875rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em", width:i===0?"45%":i===4?"5%":"auto" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item,idx) => {
                    const alert = stockAlert(item);
                    return (
                      <React.Fragment key={idx}>
                        <tr style={{ borderTop:"1px solid #F1F5F9" }}>
                          <td style={{ padding:"8px 12px" }}>
                            <select className="select" style={{ width:"100%" }} value={item.prodId} onChange={e=>setItem(idx,"prodId",Number(e.target.value))}>
                              <option value={0}>Seleccionar producto…</option>
                              {PRODUCTOS.map(p=><option key={p.id} value={p.id}>{p.codigo} · {p.nombre}</option>)}
                            </select>
                          </td>
                          <td style={{ padding:"8px 12px" }}><input className="input" type="number" min={1} value={item.qty} style={{ textAlign:"right" }} onChange={e=>setItem(idx,"qty",Number(e.target.value)||1)}/></td>
                          <td style={{ padding:"8px 12px" }}><input className="input tabular" type="number" value={item.precio} style={{ textAlign:"right" }} onChange={e=>setItem(idx,"precio",Number(e.target.value))}/></td>
                          <td style={{ padding:"8px 12px", textAlign:"right", fontFamily:"JetBrains Mono, monospace", fontWeight:600, color:"#0F172A" }}>{fmtCLP(item.qty*item.precio)}</td>
                          <td style={{ padding:"8px 6px", textAlign:"center" }}><button style={{ background:"none", border:"none", cursor:"pointer", color:"#CBD5E1" }} onClick={()=>setItems(items.filter((_,i)=>i!==idx))}><Ico p={I.x} size={14}/></button></td>
                        </tr>
                        {alert && (
                          <tr>
                            <td colSpan={5} style={{ padding:"0 12px 8px" }}>
                              <div className={alert.type==="critical"?"alert-danger":"alert-warn"}>
                                <Ico p={I.alert} size={14}/>
                                <div style={{ flex:1 }}><strong>{alert.prod.nombre}:</strong> {alert.type==="critical" ? "Sin stock disponible." : `Solo ${fmt(alert.prod.stock)} L disponibles (mínimo: ${fmt(alert.prod.stockMin)} L).`}</div>
                                <button className="btn btn-ghost btn-sm" style={{ flexShrink:0 }} onClick={()=>{setAiProd(alert.prod);setShowAi(true);}}>
                                  <Ico p={I.sparkle} size={13}/> Consultar IA
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:16 }}>
            <div className="field"><label className="label">Observaciones</label><textarea className="textarea" placeholder="Condiciones especiales, descuentos pactados…"/></div>
            <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:8, padding:16 }}>
              {[["Subtotal neto",fmtCLP(subtotal)],["IVA (19%)",fmtCLP(iva)]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.8125rem", color:"#475569", marginBottom:6 }}><span>{l}</span><span className="tabular">{v}</span></div>
              ))}
              <hr className="divider" style={{ margin:"8px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, color:"#0F172A", fontSize:"1rem" }}>
                <span>Total</span><span className="tabular" style={{ color:"#00995A" }}>{fmtCLP(subtotal+iva)}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #E2E8F0", display:"flex", gap:8, background:"#FAFAFA", borderRadius:"0 0 12px 12px" }}>
          <button className="btn btn-ghost btn-sm">Guardar borrador</button>
          <div style={{ flex:1 }}/>
          <button className="btn btn-ghost btn-sm"><Ico p={I.pdf} size={13}/> Exportar PDF</button>
          <button className="btn btn-ghost btn-sm"><Ico p={I.mail} size={13}/> Enviar por correo</button>
          <button className="btn btn-primary btn-sm" onClick={onClose}><Ico p={I.check} size={13}/> Emitir cotización</button>
        </div>
      </div>

      {showAi && aiProd && (
        <div className="modal-backdrop" style={{ zIndex:80 }} onClick={()=>setShowAi(false)}>
          <div className="modal" style={{ width:480, padding:24 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}><Ico p={I.sparkle} size={18}/><h3 style={{ fontWeight:700, color:"#0F172A" }}>Consulta IA · Stockout</h3></div>
              <button onClick={()=>setShowAi(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18}/></button>
            </div>
            <div className="alert-warn" style={{ marginBottom:16 }}><Ico p={I.alert} size={14}/><span><strong>{aiProd.nombre}</strong> — Stock: {fmt(aiProd.stock)} L / Mínimo: {fmt(aiProd.stockMin)} L</span></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[
                { l:"Días hasta quiebre", v:aiProd.stock===0?"0 — AHORA":"4 días", c:"#DC2626" },
                { l:"Tiempo de reposición", v:"38–45 días", c:"#0052CC" },
                { l:"Cantidad a comprar", v:`${fmt(aiProd.stockMin*2)} L`, c:"#0F172A" },
                { l:"Precio estimado", v:fmtCLP(PRECIOS[aiProd.id]??200000), c:"#00995A" },
                { l:"Momento de compra", v:"Inmediato", c:"#B91C1C" },
                { l:"Proveedor sugerido", v:"Polymer Solutions Inc.", c:"#475569" },
              ].map(r=>(
                <div key={r.l} style={{ background:"#F8FAFC", borderRadius:7, padding:"10px 12px" }}>
                  <div style={{ fontSize:"0.6875rem", color:"#94A3B8", marginBottom:4 }}>{r.l}</div>
                  <div style={{ fontWeight:700, color:r.c, fontFamily:"JetBrains Mono, monospace", fontSize:"0.875rem" }}>{r.v}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }} onClick={()=>setShowAi(false)}>
              <Ico p={I.pdf} size={14}/> Generar Informe de Predicción PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Cotizaciones() {
  const [showCrear, setShowCrear] = useState(false);
  const [emailQuote, setEmailQuote] = useState<typeof COTIZACIONES[0]|null>(null);
  const [ocQuote, setOcQuote] = useState<typeof COTIZACIONES[0]|null>(null);
  const [selectedOc, setSelectedOc] = useState("");
  const [associatedOcs, setAssociatedOcs] = useState<Record<string, string>>({});
  const [sentQuote, setSentQuote] = useState<string|null>(null);

  const openOcAssociation = (quote: typeof COTIZACIONES[0]) => {
    setOcQuote(quote);
    setSelectedOc(associatedOcs[quote.id] ?? quote.oc ?? "");
  };

  return (
    <div>
      <PageTitle title="Cotizaciones" sub="Ciclo de vida comercial">
        <button className="btn btn-primary" onClick={()=>setShowCrear(true)}><Ico p={I.plus} size={14}/> Nueva cotización</button>
      </PageTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
        <div className="kpi"><div className="kpi-label">Vigentes</div><div className="kpi-value tabular">6</div><div className="kpi-sub">$12,4M CLP</div></div>
        <div className="kpi"><div className="kpi-label">Convertidas (mes)</div><div className="kpi-value tabular">14</div><div className="kpi-sub">Tasa: 82%</div></div>
        <div className="kpi"><div className="kpi-label">Vencidas</div><div className="kpi-value tabular" style={{ color:"#B45309" }}>3</div></div>
        <div className="kpi"><div className="kpi-label">Valor total</div><div className="kpi-value tabular">$28,3M</div><div className="kpi-sub">CLP mes actual</div></div>
      </div>
      <div className="panel">
        <table className="dt w-full">
          <thead><tr><th>N° Cotización</th><th>Cliente</th><th>Fecha</th><th>Vigencia</th><th>Total (CLP)</th><th>OC</th><th>Factura</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {COTIZACIONES.map(c=>(
              <tr key={c.id}>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", fontWeight:700, color:"#0052CC" }}>{c.id}</td>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{c.cliente}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{c.fecha}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{c.vigencia}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, color:"#0F172A" }}>{fmtCLP(c.total)}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#0052CC" }}>{associatedOcs[c.id] ?? c.oc ?? "—"}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#00995A" }}>{c.factura??"—"}</td>
                <td><Badge t={c.estado==="Vigente"?"ok":c.estado==="Convertida"?"info":"warn"}>{c.estado}</Badge></td>
                <td>
                  <div style={{ display:"flex", gap:4 }}>
                    <button className="btn btn-ghost btn-sm" title="Exportar cotización en PDF" aria-label={`Exportar ${c.id} en PDF`}><Ico p={I.pdf} size={13}/></button>
                    <button className="btn btn-ghost btn-sm" title="Enviar PDF por correo" aria-label={`Enviar ${c.id} por correo`} onClick={()=>{setEmailQuote(c);setSentQuote(null);}}><Ico p={I.mail} size={13}/></button>
                    {c.estado==="Vigente"&&<button className="btn btn-navy btn-sm" onClick={()=>openOcAssociation(c)}>→ OC</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {emailQuote && (
        <div className="modal-backdrop" onClick={()=>setEmailQuote(null)}>
          <div className="modal" style={{ width:480, padding:24 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
              <div>
                <h2 style={{ fontWeight:700, color:"#0F172A", fontSize:"1rem" }}>Enviar cotización por correo</h2>
                <p style={{ fontSize:"0.75rem", color:"#64748B", marginTop:3 }}>{emailQuote.id} · PDF generado</p>
              </div>
              <button onClick={()=>setEmailQuote(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18}/></button>
            </div>
            {sentQuote ? (
              <div className="alert-ok"><Ico p={I.check} size={14}/><span>PDF enviado correctamente a <strong>{sentQuote}</strong>.</span></div>
            ) : (
              <>
                <div className="alert-info" style={{ marginBottom:16 }}><Ico p={I.mail} size={14}/><span>Se enviará el PDF al correo registrado del cliente.</span></div>
                <div className="field"><label className="label">Correo del cliente</label><input className="input" type="email" value={CLIENTES.find(c=>c.razon===emailQuote.cliente)?.email ?? ""} readOnly /></div>
                <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:20 }}>
                  <button className="btn btn-ghost" onClick={()=>setEmailQuote(null)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={()=>setSentQuote(CLIENTES.find(c=>c.razon===emailQuote.cliente)?.email ?? "correo del cliente")}><Ico p={I.mail} size={14}/> Enviar PDF</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {ocQuote && (
        <div className="modal-backdrop" onClick={()=>setOcQuote(null)}>
          <div className="modal" style={{ width:480, padding:24 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
              <div>
                <h2 style={{ fontWeight:700, color:"#0F172A", fontSize:"1rem" }}>Asociar orden de compra</h2>
                <p style={{ fontSize:"0.75rem", color:"#64748B", marginTop:3 }}>{ocQuote.id} · {ocQuote.cliente}</p>
              </div>
              <button onClick={()=>setOcQuote(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18}/></button>
            </div>
            <div className="field"><label className="label">Orden de compra relacionada</label><select className="select" value={selectedOc} onChange={e=>setSelectedOc(e.target.value)}><option value="">Seleccionar OC…</option><option>OC-2024-041</option><option>OC-2024-040</option><option>OC-2024-039</option></select></div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:20 }}>
              <button className="btn btn-ghost" onClick={()=>setOcQuote(null)}>Cancelar</button>
              <button className="btn btn-primary" disabled={!selectedOc} onClick={()=>{setAssociatedOcs({...associatedOcs,[ocQuote.id]:selectedOc});setOcQuote(null);}}><Ico p={I.check} size={14}/> Guardar asociación</button>
            </div>
          </div>
        </div>
      )}
      {showCrear && <CreadorCotizacion onClose={()=>setShowCrear(false)}/>}
    </div>
  );
}

// ─── OC ───────────────────────────────────────────────────────────────────────
function OC() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showUpload, setShowUpload] = useState<string|null>(null);
  const [previewUpload, setPreviewUpload] = useState<{ oc: string; file: string }|null>(null);
  const [uploaded, setUploaded] = useState<Record<string,string>>({});
  const [uploadedUrls, setUploadedUrls] = useState<Record<string,string>>({});
  const ocs = [
    { id:"OC-2024-041", cot:"COT-2024-040", cliente:"Constructora Vial Sur Ltda.", fecha:"2024-06-06", total:1_840_000, estado:"Aprobada", factura:"FAC-2024-121" },
    { id:"OC-2024-040", cot:"COT-2024-038", cliente:"Agrícola Atacama SpA", fecha:"2024-05-25", total:570_000, estado:"Pendiente facturar", factura:null as string|null },
    { id:"OC-2024-039", cot:"COT-2024-039", cliente:"Portuaria del Pacífico", fecha:"2024-06-02", total:7_680_000, estado:"En despacho", factura:null },
  ];
  return (
    <div>
      <PageTitle title="Órdenes de Compra" sub="OC recibidas de clientes — registro y trazabilidad con cotizaciones y facturas relacionadas" />
      <div className="panel">
        <table className="dt w-full">
          <thead><tr><th>N° OC</th><th>Cotización</th><th>Cliente</th><th>Fecha</th><th>Total (CLP)</th><th>Factura</th><th>Estado</th><th>Archivo OC</th><th></th></tr></thead>
          <tbody>
            {ocs.map(o=>(
              <tr key={o.id}>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", fontWeight:700, color:"#0052CC" }}>{o.id}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{o.cot}</td>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{o.cliente}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{o.fecha}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, color:"#0F172A" }}>{fmtCLP(o.total)}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:o.factura?"#00995A":"#94A3B8" }}>{o.factura??"—"}</td>
                <td><Badge t={o.estado==="Aprobada"?"ok":o.estado==="En despacho"?"info":"warn"}>{o.estado}</Badge></td>
                <td>
                  {uploaded[o.id] ? (
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:"0.6875rem", color:"#00995A", display:"flex", alignItems:"center", gap:4 }}><Ico p={I.check} size={12}/>{uploaded[o.id]}</span>
                      <button className="btn btn-ghost btn-sm" onClick={()=>setPreviewUpload({ oc:o.id, file:uploaded[o.id] })}>Vista previa</button>
                    </div>
                  ) : (
                    <button className="btn btn-ghost btn-sm" onClick={()=>setShowUpload(o.id)}><Ico p={I.upload} size={12}/> Subir PDF</button>
                  )}
                </td>
                <td>{!o.factura&&<button className="btn btn-primary btn-sm" title="Crear factura asociada a esta orden de compra"><Ico p={I.invoice} size={12}/> Crear factura</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showUpload && (
        <div className="modal-backdrop" onClick={()=>setShowUpload(null)}>
          <div className="modal" style={{ width:420, padding:24 }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontWeight:700, color:"#0F172A", marginBottom:16 }}>Subir Orden de Compra — {showUpload}</h3>
            <div style={{ border:"2px dashed #CBD5E1", borderRadius:8, padding:"32px 24px", textAlign:"center", cursor:"pointer", background:"#F8FAFC" }} onClick={()=>fileRef.current?.click()}>
              <Ico p={I.upload} size={28}/>
              <p style={{ fontSize:"0.8125rem", color:"#64748B", marginTop:8 }}>Haz clic o arrastra el PDF aquí</p>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>{ if(e.target.files?.[0]){const file=e.target.files[0];setUploaded({...uploaded,[showUpload!]:file.name});setUploadedUrls({...uploadedUrls,[showUpload!]:URL.createObjectURL(file)});setShowUpload(null);}}}/>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }} onClick={()=>{setUploaded({...uploaded,[showUpload!]:"OC_cliente.pdf"});setShowUpload(null);}}><Ico p={I.check} size={14}/> Confirmar</button>
              <button className="btn btn-ghost" onClick={()=>setShowUpload(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {previewUpload && (
        <div className="modal-backdrop" onClick={()=>setPreviewUpload(null)}>
          <div className="modal" style={{ width:640, padding:0 }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"14px 20px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div><div style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A" }}>Vista previa — {previewUpload.oc}</div><div style={{ fontSize:"0.6875rem", color:"#94A3B8" }}>{previewUpload.file} · PDF subido</div></div>
              <button onClick={()=>setPreviewUpload(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18}/></button>
            </div>
            <div style={{ padding:24, background:"#F1F5F9" }}>
              {uploadedUrls[previewUpload.oc] ? (
                <iframe title={`Vista previa de ${previewUpload.file}`} src={uploadedUrls[previewUpload.oc]} style={{ width:"100%", height:520, border:"1px solid #E2E8F0", background:"white" }} />
              ) : <div style={{ minHeight:360, background:"white", border:"1px solid #E2E8F0", boxShadow:"0 4px 12px rgba(15,23,42,0.08)", padding:32 }}>
                <div style={{ display:"flex", justifyContent:"space-between", borderBottom:"2px solid #00995A", paddingBottom:18, marginBottom:24 }}>
                  <div><div style={{ fontSize:"1.1rem", fontWeight:800, color:"#00995A" }}>Ecoterra</div><div style={{ fontSize:"0.6875rem", color:"#64748B", marginTop:3 }}>Orden de compra recibida</div></div>
                  <div style={{ textAlign:"right" }}><div style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, color:"#0F172A" }}>{previewUpload.oc}</div><div style={{ fontSize:"0.6875rem", color:"#64748B", marginTop:3 }}>Documento PDF</div></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, fontSize:"0.75rem", color:"#475569" }}>
                  <div><strong style={{ color:"#0F172A" }}>Cliente</strong><div style={{ marginTop:5 }}>{ocs.find(o=>o.id===previewUpload.oc)?.cliente}</div></div>
                  <div><strong style={{ color:"#0F172A" }}>Cotización asociada</strong><div style={{ marginTop:5 }}>{ocs.find(o=>o.id===previewUpload.oc)?.cot}</div></div>
                  <div><strong style={{ color:"#0F172A" }}>Monto total</strong><div style={{ marginTop:5, fontFamily:"JetBrains Mono, monospace" }}>{fmtCLP(ocs.find(o=>o.id===previewUpload.oc)?.total ?? 0)}</div></div>
                  <div><strong style={{ color:"#0F172A" }}>Archivo</strong><div style={{ marginTop:5 }}>{previewUpload.file}</div></div>
                </div>
                <div style={{ marginTop:42, borderTop:"1px solid #E2E8F0", paddingTop:14, fontSize:"0.6875rem", color:"#94A3B8" }}>Vista previa del documento cargado · No editable</div>
              </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FACTURACIÓN ──────────────────────────────────────────────────────────────
function Facturacion() {
  const [viewFac, setViewFac] = useState<typeof FACTURAS[0]|null>(null);
  return (
    <div>
      <PageTitle title="Facturación" sub="Documentos tributarios electrónicos 1:1 con OC">
        <button className="btn btn-primary"><Ico p={I.plus} size={14}/> Nueva factura</button>
      </PageTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
        <div className="kpi"><div className="kpi-label">Total facturado (mes)</div><div className="kpi-value tabular">{fmtCLP(13_770_000)}</div></div>
        <div className="kpi"><div className="kpi-label">Pagadas</div><div className="kpi-value tabular" style={{ color:"#15803D" }}>1</div></div>
        <div className="kpi"><div className="kpi-label">Pendientes</div><div className="kpi-value tabular" style={{ color:"#B45309" }}>1</div></div>
        <div className="kpi"><div className="kpi-label">Vencidas</div><div className="kpi-value tabular" style={{ color:"#DC2626" }}>1</div></div>
      </div>
      <div className="panel">
        <table className="dt w-full">
          <thead><tr><th>N° Factura</th><th>OC</th><th>Cliente</th><th>Emisión</th><th>Vencimiento</th><th>Subtotal</th><th>IVA</th><th>Total (CLP)</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {FACTURAS.map(f=>(
              <tr key={f.id}>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", fontWeight:700, color:"#0052CC" }}>{f.id}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{f.oc}</td>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{f.cliente}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{f.fecha}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:f.estado==="Vencida"?"#DC2626":"#64748B", fontWeight:f.estado==="Vencida"?700:400 }}>{f.venc}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", color:"#475569" }}>{fmtCLP(f.subtotal)}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", color:"#475569" }}>{fmtCLP(f.iva)}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, color:"#0F172A" }}>{fmtCLP(f.total)}</td>
                <td><Badge t={f.estado==="Pagada"?"ok":f.estado==="Vencida"?"danger":"warn"}>{f.estado}</Badge></td>
                <td><div style={{ display:"flex", gap:4 }}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setViewFac(f)}><Ico p={I.pdf} size={13}/></button>
                  <button className="btn btn-ghost btn-sm"><Ico p={I.mail} size={13}/></button>
                  <button className="btn btn-ghost btn-sm"><Ico p={I.nc} size={13}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewFac && (
        <div className="modal-backdrop" onClick={()=>setViewFac(null)}>
          <div className="modal" style={{ width:640, padding:0 }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"14px 20px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div><div style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A" }}>Vista Previa — {viewFac.id}</div><div style={{ fontSize:"0.6875rem", color:"#94A3B8" }}>Documento electrónico · No editable</div></div>
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn btn-ghost btn-sm"><Ico p={I.download} size={13}/> PDF</button>
                <button className="btn btn-ghost btn-sm"><Ico p={I.mail} size={13}/> Enviar</button>
                <button onClick={()=>setViewFac(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18}/></button>
              </div>
            </div>
            <div style={{ padding:24 }}>
              <div style={{ border:"1px solid #E2E8F0", borderRadius:10, padding:"28px 32px", position:"relative" }}>
                <div style={{ position:"absolute", top:24, right:24, width:72, height:72, borderRadius:"50%", border:"3px solid rgba(0,153,90,0.2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", transform:"rotate(15deg)" }}>
                  <Ico p={I.lock} size={14}/><span style={{ fontSize:"0.5rem", fontWeight:900, color:"#00995A", letterSpacing:"0.05em", marginTop:2 }}>ORIGINAL</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    <img src={logoEcoterra} alt="Ecoterra" style={{ height:30, width:"auto", objectFit:"contain" }} />
                    <div style={{ fontSize:"0.6875rem", color:"#64748B" }}>RUT 76.456.789-2 · Av. Apoquindo 5950, Santiago</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontWeight:900, fontSize:"1.25rem", color:"#00995A" }}>FACTURA</div>
                    <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.875rem", fontWeight:700, color:"#0F172A" }}>{viewFac.id}</div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                  <div style={{ background:"#F8FAFC", padding:"10px 12px", borderRadius:7 }}>
                    <div style={{ fontSize:"0.6875rem", color:"#94A3B8", marginBottom:2 }}>Receptor</div>
                    <div style={{ fontWeight:700, color:"#0F172A" }}>{viewFac.cliente}</div>
                  </div>
                  <div style={{ background:"#F8FAFC", padding:"10px 12px", borderRadius:7 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, fontSize:"0.75rem" }}>
                      {[["OC",viewFac.oc],["Emisión",viewFac.fecha],["Vence",viewFac.venc]].map(([l,v])=>(
                        <div key={l}><div style={{ color:"#94A3B8" }}>{l}</div><div style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:600 }}>{v}</div></div>
                      ))}
                    </div>
                  </div>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
                  <thead><tr style={{ borderBottom:"2px solid #E2E8F0" }}>
                    {["Descripción","Cant.","P. Unit.","Total"].map(h=>(
                      <th key={h} style={{ padding:"6px 8px", textAlign:h==="Descripción"?"left":"right", fontSize:"0.6875rem", fontWeight:700, color:"#64748B", textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody><tr style={{ borderBottom:"1px solid #F1F5F9" }}>
                    <td style={{ padding:"8px", fontSize:"0.8125rem", color:"#0F172A" }}>EcoStab Polímero Estabilizador 500L</td>
                    <td style={{ padding:"8px", textAlign:"right", fontFamily:"JetBrains Mono, monospace" }}>10</td>
                    <td style={{ padding:"8px", textAlign:"right", fontFamily:"JetBrains Mono, monospace" }}>$285.000</td>
                    <td style={{ padding:"8px", textAlign:"right", fontFamily:"JetBrains Mono, monospace", fontWeight:700 }}>$2.850.000</td>
                  </tr></tbody>
                </table>
                <div style={{ textAlign:"right", paddingTop:12, borderTop:"1px solid #E2E8F0" }}>
                  {[["Subtotal",fmtCLP(viewFac.subtotal)],["IVA (19%)",fmtCLP(viewFac.iva)]].map(([l,v])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"flex-end", gap:40, fontSize:"0.8125rem", color:"#64748B", marginBottom:4 }}><span>{l}</span><span className="tabular">{v}</span></div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"flex-end", gap:40, fontWeight:900, color:"#0F172A", fontSize:"1.125rem", marginTop:6, borderTop:"2px solid #0F172A", paddingTop:6 }}>
                    <span>TOTAL CLP</span><span className="tabular">{fmtCLP(viewFac.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTAS DE CRÉDITO ─────────────────────────────────────────────────────────
function NotasCredito() {
  const [showNew, setShowNew] = useState(false);
  const ncs = [
    { id:"NC-2024-003", factura:"FAC-2024-120", cliente:"Portuaria del Pacífico", fecha:"2024-06-15", monto:-580_000, motivo:"Devolución parcial — envase dañado" },
    { id:"NC-2024-002", factura:"FAC-2024-118", cliente:"Agrícola Atacama SpA", fecha:"2024-05-10", monto:-142_800, motivo:"Ajuste de precio por volumen" },
  ];
  return (
    <div>
      <PageTitle title="Notas de Crédito" sub="Documentos asociados a facturas emitidas">
        <button className="btn btn-primary" onClick={()=>setShowNew(true)}><Ico p={I.plus} size={14}/> Nueva NC</button>
      </PageTitle>
      <div className="panel">
        <table className="dt w-full">
          <thead><tr><th>N° NC</th><th>Factura Origen</th><th>Cliente</th><th>Fecha</th><th>Monto (CLP)</th><th>Motivo</th><th></th></tr></thead>
          <tbody>
            {ncs.map(n=>(
              <tr key={n.id}>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", fontWeight:700, color:"#DC2626" }}>{n.id}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#0052CC" }}>{n.factura}</td>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{n.cliente}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", color:"#64748B" }}>{n.fecha}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, color:"#DC2626" }}>{fmtCLP(n.monto)}</td>
                <td style={{ fontSize:"0.8125rem", color:"#475569" }}>{n.motivo}</td>
                <td><button className="btn btn-ghost btn-sm"><Ico p={I.pdf} size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showNew && (
        <div className="modal-backdrop" onClick={()=>setShowNew(false)}>
          <div className="modal" style={{ width:520, padding:24 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
              <h2 style={{ fontWeight:700, color:"#0F172A" }}>Nueva Nota de Crédito</h2>
              <button onClick={()=>setShowNew(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><Ico p={I.x} size={18}/></button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="field"><label className="label">Factura de Origen *</label>
                <select className="select"><option value="">Seleccionar factura…</option>{FACTURAS.map(f=><option key={f.id} value={f.id}>{f.id} · {f.cliente} · {fmtCLP(f.total)}</option>)}</select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div className="field"><label className="label">Monto NC (CLP)</label><input className="input" type="number" placeholder="0"/></div>
                <div className="field"><label className="label">Fecha</label><input type="date" className="input" defaultValue="2024-06-14"/></div>
              </div>
              <div className="field"><label className="label">Motivo *</label>
                <select className="select"><option>Devolución parcial de mercancía</option><option>Ajuste de precio por volumen</option><option>Error en facturación</option><option>Descuento comercial pactado</option><option>Producto defectuoso</option></select>
              </div>
              <div className="field"><label className="label">Observaciones</label><textarea className="textarea" placeholder="Detalle adicional…"/></div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:18 }}>
              <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }} onClick={()=>setShowNew(false)}><Ico p={I.check} size={14}/> Emitir NC</button>
              <button className="btn btn-ghost" onClick={()=>setShowNew(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGÍSTICA ────────────────────────────────────────────────────────────────
function Logistica() {
  const [wizard, setWizard] = useState<typeof EMBARQUES[0]|null>(null);
  const [wStep, setWStep] = useState(0);
  const [wDest, setWDest] = useState<"bodega"|"cliente"|null>(null);

  const stepLabels = ["Destino del embarque", wDest==="bodega"?"Ingreso a bodega":"Asociar cliente", "Confirmación"];

  return (
    <div>
      <PageTitle title="Recepción de Embarques" sub="Importaciones EE.UU. → Chile · Seguimiento y recepción">
        <button className="btn btn-primary"><Ico p={I.plus} size={14}/> Registrar embarque</button>
      </PageTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
        <div className="kpi"><div className="kpi-label">En tránsito</div><div className="kpi-value tabular" style={{ color:"#0052CC" }}>2</div></div>
        <div className="kpi"><div className="kpi-label">Llegando (7 días)</div><div className="kpi-value tabular" style={{ color:"#00995A" }}>1</div></div>
        <div className="kpi"><div className="kpi-label">Recibidos (mes)</div><div className="kpi-value tabular">4</div></div>
      </div>
      <div className="panel">
        <table className="dt w-full">
          <thead><tr><th>ID</th><th>Puerto Origen</th><th>Naviera</th><th>Producto</th><th>Qty (L)</th><th>Envase</th><th>ETD</th><th>ETA</th><th>Puerto Destino</th><th>Progreso</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {EMBARQUES.map(e=>(
              <tr key={e.id}>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.75rem", fontWeight:700, color:"#0052CC" }}>{e.id}</td>
                <td style={{ fontSize:"0.8125rem" }}>{e.origen}</td>
                <td><Badge t="info">{e.naviera}</Badge></td>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{e.producto}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700 }}>{fmt(e.qty)} L</td>
                <td><Badge t="neutral">{e.tipo}</Badge></td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", color:"#64748B" }}>{e.etd}</td>
                <td style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", fontWeight:700, color:e.estado==="Llegando"?"#00995A":"#0F172A" }}>{e.eta}</td>
                <td style={{ color:"#475569" }}>{e.destino}</td>
                <td style={{ width:100 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div className="progress" style={{ flex:1 }}><div className="progress-fill" style={{ width:`${e.progreso}%`, background:e.progreso===100?"#00995A":e.progreso>80?"#16A34A":"#0052CC" }}/></div>
                    <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", color:"#64748B", flexShrink:0 }}>{e.progreso}%</span>
                  </div>
                </td>
                <td><Badge t={e.estado==="Recibido"?"ok":e.estado==="Llegando"?"purple":"info"}>{e.estado}</Badge></td>
                <td>{e.estado!=="Recibido"&&<button className="btn btn-primary btn-sm" onClick={()=>{setWizard(e);setWStep(0);setWDest(null);}}>Recepcionar</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {wizard && (
        <div className="modal-backdrop" onClick={()=>setWizard(null)}>
          <div className="modal" style={{ width:560, padding:0 }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"16px 24px", borderBottom:"1px solid #E2E8F0" }}>
              <div style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A", marginBottom:12 }}>Recepcionar Embarque — {wizard.id}</div>
              <div style={{ display:"flex", alignItems:"center" }}>
                {stepLabels.map((l,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div className={`step-dot ${i<wStep?"done":i===wStep?"active":""}`}>{i<wStep?<Ico p={I.check} size={12}/>:i+1}</div>
                      <span style={{ fontSize:"0.6875rem", color:i<=wStep?"#0F172A":"#94A3B8", fontWeight:i===wStep?600:400, whiteSpace:"nowrap" }}>{l}</span>
                    </div>
                    {i<stepLabels.length-1&&<div style={{ flex:1, height:1, background:i<wStep?"#00995A":"#E2E8F0", margin:"0 8px" }}/>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding:"24px" }}>
              {wStep===0 && (
                <div>
                  <p style={{ fontWeight:600, color:"#0F172A", marginBottom:16 }}>¿Cuál es el destino del embarque <strong>{wizard.id}</strong>?</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {[
                      { k:"bodega", icon:I.warehouse, label:"A Bodega Ecoterra", desc:"Ingresar al inventario propio." },
                      { k:"cliente", icon:I.clients, label:"Entrega directa al cliente", desc:"Despacho sin pasar por bodega." },
                    ].map(opt=>(
                      <button key={opt.k} onClick={()=>setWDest(opt.k as any)} style={{ padding:20, border:`2px solid ${wDest===opt.k?"#00995A":"#E2E8F0"}`, borderRadius:10, cursor:"pointer", background:wDest===opt.k?"#F0FDF4":"white", textAlign:"left", transition:"all 0.15s" }}>
                        <div style={{ color:wDest===opt.k?"#00995A":"#64748B", marginBottom:8 }}><Ico p={opt.icon} size={24}/></div>
                        <div style={{ fontWeight:700, color:"#0F172A", marginBottom:4 }}>{opt.label}</div>
                        <div style={{ fontSize:"0.75rem", color:"#64748B" }}>{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {wStep===1 && wDest==="bodega" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div style={{ gridColumn:"1/-1" }}><div className="alert-info"><Ico p={I.ship} size={14}/><span>{wizard.id} · {wizard.producto} · {fmt(wizard.qty)} L</span></div></div>
                  <div className="field" style={{ gridColumn:"1/-1" }}><label className="label">Código QR / Código de barras</label><input className="input" placeholder="Escanear o ingresar manualmente…"/></div>
                  <div className="field"><label className="label">Tipo de Envase</label><select className="select"><option>Tambor 200 L</option><option>IBC 1000 L</option></select></div>
                  <div className="field"><label className="label">Cantidad (litros)</label><input className="input" type="number" defaultValue={wizard.qty}/></div>
                  <div className="field"><label className="label">Fecha de Fabricación</label><input type="date" className="input"/></div>
                  <div className="field"><label className="label">Fecha de Vencimiento</label><input type="date" className="input"/></div>
                  <div className="field"><label className="label">Ubicación en bodega</label><input className="input" placeholder="Ej: A2-03"/></div>
                  <div className="field"><label className="label">N° Batch fabricante</label><input className="input" placeholder="Ej: B240620"/></div>
                </div>
              )}
              {wStep===1 && wDest==="cliente" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div style={{ gridColumn:"1/-1" }}><div className="alert-info"><Ico p={I.ship} size={14}/><span>{wizard.id} · {wizard.producto} · {fmt(wizard.qty)} L</span></div></div>
                  <div className="field" style={{ gridColumn:"1/-1" }}><label className="label">Cliente receptor *</label>
                    <select className="select"><option value="">Seleccionar cliente…</option>{CLIENTES.map(c=><option key={c.id} value={c.id}>{c.razon}</option>)}</select>
                  </div>
                  <div className="field" style={{ gridColumn:"1/-1" }}><label className="label">Dirección de entrega *</label><select className="select"><option>Seleccionar dirección…</option></select></div>
                  <div className="field"><label className="label">Producto</label><input className="input" value={wizard.producto} readOnly/></div>
                  <div className="field"><label className="label">Cantidad (litros)</label><input className="input" type="number" defaultValue={wizard.qty}/></div>
                  <div className="field" style={{ gridColumn:"1/-1" }}><label className="label">OC asociada</label><input className="input" placeholder="Ej: OC-2024-041"/></div>
                </div>
              )}
              {wStep===2 && (
                <div style={{ textAlign:"center", padding:"24px 0" }}>
                  <div style={{ width:60, height:60, borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}><Ico p={I.check} size={30}/></div>
                  <p style={{ fontWeight:700, fontSize:"1rem", color:"#15803D" }}>¡Embarque recepcionado!</p>
                  <p style={{ fontSize:"0.8125rem", color:"#64748B", marginTop:6 }}>{wizard.id} — {fmt(wizard.qty)} L ingresados{wDest==="bodega"?" a bodega Ecoterra.":" para entrega directa al cliente."}</p>
                  <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:20 }}>
                    <button className="btn btn-ghost btn-sm"><Ico p={I.pdf} size={13}/> Imprimir recepción</button>
                    <button className="btn btn-primary btn-sm" onClick={()=>setWizard(null)}>Cerrar</button>
                  </div>
                </div>
              )}
            </div>
            {wStep<2 && (
              <div style={{ padding:"14px 24px", borderTop:"1px solid #E2E8F0", display:"flex", gap:8, justifyContent:"flex-end" }}>
                {wStep>0&&<button className="btn btn-ghost btn-sm" onClick={()=>setWStep(wStep-1)}>← Anterior</button>}
                <button className="btn btn-primary" disabled={wStep===0&&!wDest} onClick={()=>setWStep(wStep+1)}>{wStep===1?"Confirmar recepción":"Continuar →"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── IA PANEL ─────────────────────────────────────────────────────────────────
function IaPanel() {
  const [w1, setW1] = useState({ puerto:"Corpus Christi, TX", naviera:"MSC", carga:"IBC 1000 L", mes:"Julio" });
  const [r1, setR1] = useState<{ dias:number; conf:number }|null>(null);
  const [l1, setL1] = useState(false);

  const [w2, setW2] = useState({ prod:"", fecha:"2024-09-01", qty:"10" });
  const [r2, setR2] = useState<{ precio:number; varPct:string }|null>(null);
  const [l2, setL2] = useState(false);

  const [selProd, setSelProd] = useState<typeof PRODUCTOS[0]|null>(null);
  const stockAlerts = PRODUCTOS.filter(p => p.stock < p.stockMin);

  const predict1 = () => {
    setL1(true);
    setTimeout(() => {
      const base: Record<string,number> = {"Corpus Christi, TX":42,"Miami, FL":38,"Los Angeles, CA":29,"San Diego, CA":30};
      const navAdj: Record<string,number> = {"MSC":0,"Hapag-Lloyd":-2,"Evergreen":3,"Maersk":-1};
      const dias = (base[w1.puerto]??40)+(navAdj[w1.naviera]??0)+Math.floor(Math.random()*4-2);
      setR1({ dias, conf:85+Math.floor(Math.random()*10) });
      setL1(false);
    }, 1400);
  };

  const predict2 = () => {
    setL2(true);
    setTimeout(() => {
      const p = PRODUCTOS.find(p=>p.codigo===w2.prod);
      if(!p) return setL2(false);
      const factor = 1+(Math.random()*0.14-0.04);
      setR2({ precio: Math.round((PRECIOS[p.id]??200000)*factor), varPct: factor>1?`+${((factor-1)*100).toFixed(1)}%`:`${((factor-1)*100).toFixed(1)}%` });
      setL2(false);
    }, 1100);
  };

  const DAILY: Record<number,number> = { 1:75, 2:55, 3:30, 4:42, 5:28 };
  const daysLeft = (p: typeof PRODUCTOS[0]) => p.stock===0 ? 0 : Math.floor(p.stock/(DAILY[p.id]??20));
  const reorderQty = (p: typeof PRODUCTOS[0]) => Math.max(p.stockMin*2-p.stock, p.stockMin);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center" }}><Ico p={I.sparkle} size={20}/></div>
        <div>
          <h1 style={{ fontSize:"1.25rem", fontWeight:700, color:"#0F172A", letterSpacing:"-0.01em" }}>Panel de Inteligencia Artificial</h1>
          <p style={{ fontSize:"0.75rem", color:"#64748B" }}>Modelos predictivos entrenados con datos operativos de Ecoterra</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Widget 1 */}
        <div className="panel">
          <div className="panel-header">
            <div style={{ display:"flex", alignItems:"center", gap:8 }}><Ico p={I.ship} size={15}/><span style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A" }}>Predicción · Tiempo de Llegada</span></div>
            <Badge t="info">Modelo v2.1</Badge>
          </div>
          <div style={{ padding:18 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              <div className="field"><label className="label">Puerto de origen</label>
                <select className="select" value={w1.puerto} onChange={e=>setW1({...w1,puerto:e.target.value})}>
                  <option>Corpus Christi, TX</option><option>Miami, FL</option><option>Los Angeles, CA</option><option>San Diego, CA</option>
                </select>
              </div>
              <div className="field"><label className="label">Naviera</label>
                <select className="select" value={w1.naviera} onChange={e=>setW1({...w1,naviera:e.target.value})}>
                  <option>MSC</option><option>Hapag-Lloyd</option><option>Evergreen</option><option>Maersk</option><option>CMA CGM</option>
                </select>
              </div>
              <div className="field"><label className="label">Tipo de carga</label>
                <select className="select" value={w1.carga} onChange={e=>setW1({...w1,carga:e.target.value})}>
                  <option>IBC 1000 L</option><option>Tambor 200 L</option><option>Contenedor FCL</option>
                </select>
              </div>
              <div className="field"><label className="label">Mes de embarque</label>
                <select className="select" value={w1.mes} onChange={e=>setW1({...w1,mes:e.target.value})}>
                  {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }} onClick={predict1} disabled={l1}>
              {l1?<><div className="spinner"/> Calculando…</>:<><Ico p={I.sparkle} size={14}/> Calcular Predicción</>}
            </button>
            {r1 && (
              <div style={{ marginTop:14, background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:9, padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:6 }}>
                  <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"2.5rem", fontWeight:900, color:"#00995A", lineHeight:1 }}>{r1.dias}</span>
                  <span style={{ fontWeight:700, color:"#166534", fontSize:"1rem" }}>días estimados</span>
                </div>
                <div style={{ fontSize:"0.75rem", color:"#166534", marginBottom:8 }}>Confianza: <strong className="tabular">{r1.conf}%</strong> · Rango: {r1.dias-3}–{r1.dias+5} días</div>
                <div className="progress"><div className="progress-fill" style={{ width:`${r1.conf}%`, background:"#00995A" }}/></div>
                <p style={{ fontSize:"0.6875rem", color:"#166534", marginTop:8 }}>→ Emitir OC con al menos <strong>{r1.dias+5} días de anticipación</strong> para garantizar continuidad.</p>
              </div>
            )}
          </div>
        </div>

        {/* Widget 2 */}
        <div className="panel">
          <div className="panel-header">
            <div style={{ display:"flex", alignItems:"center", gap:8 }}><Ico p={I.bar} size={15}/><span style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A" }}>Predicción · Precio de Compra</span></div>
            <Badge t="info">Modelo v1.4</Badge>
          </div>
          <div style={{ padding:18 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
              <div className="field"><label className="label">Producto</label>
                <select className="select" value={w2.prod} onChange={e=>setW2({...w2,prod:e.target.value})}>
                  <option value="">Seleccionar producto…</option>
                  {PRODUCTOS.map(p=><option key={p.id} value={p.codigo}>{p.codigo} · {p.nombre}</option>)}
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div className="field"><label className="label">Fecha estimada</label><input type="date" className="input" value={w2.fecha} onChange={e=>setW2({...w2,fecha:e.target.value})}/></div>
                <div className="field"><label className="label">Cantidad (unidades)</label><input type="number" className="input" value={w2.qty} onChange={e=>setW2({...w2,qty:e.target.value})}/></div>
              </div>
            </div>
            <button className="btn btn-navy" style={{ width:"100%", justifyContent:"center" }} onClick={predict2} disabled={l2||!w2.prod}>
              {l2?<><div className="spinner"/> Analizando…</>:<><Ico p={I.sparkle} size={14}/> Predecir Precio</>}
            </button>
            {r2 ? (
              <div style={{ marginTop:14, background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:9, padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:6 }}>
                  <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"2rem", fontWeight:900, color:"#0052CC", lineHeight:1 }}>{fmtCLP(r2.precio)}</span>
                  <span style={{ fontWeight:700, color:"#1D4ED8" }}>/ unidad</span>
                </div>
                <div style={{ fontSize:"0.75rem", color:"#1D4ED8", marginBottom:4 }}>
                  Variación vs. precio actual: <strong style={{ color:r2.varPct.startsWith("+")?"#DC2626":"#15803D" }}>{r2.varPct}</strong>
                </div>
                <div style={{ fontSize:"0.75rem", color:"#1D4ED8" }}>
                  Total estimado ({w2.qty} ud.): <strong className="tabular">{fmtCLP(r2.precio*parseInt(w2.qty||"1"))}</strong>
                </div>
              </div>
            ) : (
              <div style={{ marginTop:14, background:"#F8FAFC", borderRadius:9, padding:"40px 20px", textAlign:"center", color:"#94A3B8", fontSize:"0.8125rem" }}>
                Selecciona producto y fecha para ver predicción.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget 3 — Stockout */}
      <div className="panel">
        <div className="panel-header">
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#DC2626" }}><Ico p={I.alert} size={15}/></span>
            <span style={{ fontWeight:700, fontSize:"0.875rem", color:"#0F172A" }}>Alertas de Stockout — Sistema Automatizado</span>
            <Badge t="danger">{stockAlerts.length} alertas</Badge>
          </div>
          <button className="btn btn-ghost btn-sm"><Ico p={I.pdf} size={13}/> Generar Informe Predicción PDF</button>
        </div>
        {stockAlerts.map(p => {
          const dias = daysLeft(p);
          const reorder = reorderQty(p);
          const isOpen = selProd?.id===p.id;
          return (
            <div key={p.id} style={{ borderBottom:"1px solid #F1F5F9" }}>
              <div style={{ padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:16, cursor:"pointer", background:isOpen?"#F8FAFC":"white" }} onClick={()=>setSelProd(isOpen?null:p)}>
                <div style={{ width:40, height:40, borderRadius:8, background:p.stock===0?"#FEE2E2":"#FEF9C3", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Ico p={I.alert} size={20}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span style={{ fontWeight:700, color:"#0F172A" }}>{p.nombre}</span>
                    <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6875rem", color:"#64748B" }}>{p.codigo}</span>
                    <Badge t={p.stock===0?"danger":"warn"}>{p.stock===0?"Sin stock":"Bajo mínimo"}</Badge>
                  </div>
                  <div className="progress" style={{ width:240, marginBottom:4 }}><div className="progress-fill" style={{ width:`${Math.min(100,(p.stock/p.stockMin)*100)}%`, background:p.stock===0?"#DC2626":"#D97706" }}/></div>
                  <div style={{ fontSize:"0.75rem", color:"#64748B" }}>Stock: <strong className="tabular">{fmt(p.stock)} L</strong> / Mínimo: <strong className="tabular">{fmt(p.stockMin)} L</strong></div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:900, fontSize:"1.5rem", color:p.stock===0?"#DC2626":"#B45309", lineHeight:1 }}>{dias===0?"0":dias}</div>
                  <div style={{ fontSize:"0.6875rem", color:"#94A3B8" }}>días restantes</div>
                  <Ico p={isOpen?I.chevD:I.chevR} size={14}/>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding:"0 18px 18px 74px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                    {[
                      { l:"Tiempo hasta quiebre", v:dias===0?"AHORA":`${dias} días`, c:dias<3?"#DC2626":"#B45309" },
                      { l:"Cantidad a comprar", v:`${fmt(reorder)} L`, c:"#0052CC" },
                      { l:"Tiempo de reposición", v:"38–45 días", c:"#0F172A" },
                      { l:"Precio estimado", v:fmtCLP(PRECIOS[p.id]??200000), c:"#00995A" },
                    ].map(r=>(
                      <div key={r.l} style={{ background:"#F8FAFC", borderRadius:8, padding:"10px 12px" }}>
                        <div style={{ fontSize:"0.6875rem", color:"#94A3B8", marginBottom:4 }}>{r.l}</div>
                        <div style={{ fontFamily:"JetBrains Mono, monospace", fontWeight:700, fontSize:"0.875rem", color:r.c }}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                    <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ fontSize:"0.6875rem", color:"#94A3B8", marginBottom:2 }}>Momento recomendado de compra</div>
                      <div style={{ fontWeight:700, color:"#15803D", fontSize:"0.8125rem" }}>{dias<5?"⚡ Inmediato":`En los próximos ${Math.max(0,dias-40)} días`}</div>
                    </div>
                    <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ fontSize:"0.6875rem", color:"#94A3B8", marginBottom:2 }}>Proveedor sugerido</div>
                      <div style={{ fontWeight:700, color:"#15803D", fontSize:"0.8125rem" }}>Polymer Solutions Inc.</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn btn-primary btn-sm"><Ico p={I.oc} size={13}/> Generar OC de Reposición</button>
                    <button className="btn btn-ghost btn-sm"><Ico p={I.pdf} size={13}/> Exportar informe</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {stockAlerts.length===0 && (
          <div style={{ padding:"40px 24px", textAlign:"center", color:"#94A3B8", fontSize:"0.8125rem" }}>No hay alertas activas de stockout.</div>
        )}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderScreen = () => {
    switch(screen) {
      case "dashboard":    return <Dashboard onNav={setScreen}/>;
      case "clientes":     return <Clientes/>;
      case "proveedores":  return <Proveedores/>;
      case "productos":    return <Productos/>;
      case "lotes":        return <Lotes/>;
      case "movimientos":  return <Movimientos/>;
      case "cotizaciones": return <Cotizaciones/>;
      case "oc":           return <OC/>;
      case "facturacion":  return <Facturacion/>;
      case "nc":           return <NotasCredito/>;
      case "ia":           return <IaPanel/>;
      default:             return <Dashboard onNav={setScreen}/>;
    }
  };

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden", background:"#F1F5F9" }}>
      <Sidebar cur={screen} onNav={setScreen} collapsed={collapsed} toggle={()=>setCollapsed(!collapsed)}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar screen={screen}/>
        <main style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
