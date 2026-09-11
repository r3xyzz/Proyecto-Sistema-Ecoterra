import React from "react";
import { Badge, fmt, I, Ico, PageTitle, Product, Screen } from "../shared";

export default function Dashboard({ productos, onNav }: { productos: Product[]; onNav: (screen: Screen) => void }) {
  const stockAlerts = productos.filter(product => product.stock < product.stockMin);
  const activity = [
    { time: "09:14", desc: "Cotización COT-2024-041 emitida — Minera Los Bronces S.A.", type: "quote" },
    { time: "07:30", desc: "Alerta IA: POL-002 cruzó umbral mínimo de stock. 300 L restantes.", type: "alert" },
    { time: "Ayer", desc: "Factura FAC-2024-122 emitida · $4.250.000 CLP · Vence 12 Jul.", type: "invoice" },
    { time: "Ayer", desc: "Lote LT-2024-005 registrado · 1.340 L POL-004 · Ubicación C3-02.", type: "lot" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PageTitle title="Dashboard" sub="Métricas operativas y alertas IA · Actualizado hace 4 min" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        <div className="kpi"><div className="kpi-label">Cotizaciones vigentes</div><div className="kpi-value tabular">6</div><div className="kpi-sub">$12,4M CLP en cartera</div></div>
        <div className="kpi"><div className="kpi-label">Facturas pendientes</div><div className="kpi-value tabular" style={{ color: "#B45309" }}>3</div><div className="kpi-sub">$10,09M CLP por cobrar</div></div>
      </div>
      <div className="panel">
        <div className="panel-header"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "#DC2626" }}><Ico p={I.alert} size={15} /></span><span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0F172A" }}>Alertas IA · Stockout</span><Badge t="danger">{stockAlerts.length}</Badge></div><button className="btn btn-ghost btn-sm" onClick={() => onNav("ia")}>Ver panel IA →</button></div>
        {stockAlerts.map(product => { const pct = Math.min(100, (product.stock / product.stockMin) * 100); return <div key={product.id} style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", gap: 12 }}><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#0F172A", marginBottom: 2 }}>{product.nombre}</div><div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: 8 }}>{product.codigo} · Mínimo: {fmt(product.stockMin)} L</div><div className="progress" style={{ width: 200 }}><div className="progress-fill" style={{ width: `${pct}%`, background: product.stock === 0 ? "#DC2626" : "#D97706" }} /></div><div style={{ fontSize: "0.6875rem", color: "#94A3B8", marginTop: 4 }}><span className="tabular" style={{ color: product.stock === 0 ? "#DC2626" : "#B45309", fontWeight: 700 }}>{fmt(product.stock)} L</span> disponibles</div></div><div style={{ textAlign: "right", flexShrink: 0 }}><Badge t={product.stock === 0 ? "danger" : "warn"}>{product.stock === 0 ? "Sin stock" : "Bajo mínimo"}</Badge><div style={{ marginTop: 8 }}><button className="btn btn-ghost btn-sm" onClick={() => onNav("ia")}>Consultar IA</button></div></div></div>; })}
      </div>
      <div className="panel">
        <div className="panel-header"><span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0F172A" }}>Stock actual por producto</span><button className="btn btn-ghost btn-sm" onClick={() => onNav("productos")}>Ver catálogo →</button></div>
        {productos.map(product => { const pct = product.stockMin === 0 ? 100 : Math.min(100, (product.stock / product.stockMin) * 100); const color = product.stock === 0 ? "#DC2626" : pct < 50 ? "#D97706" : "#00995A"; return <div key={product.id} style={{ padding: "12px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 12 }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.nombre}</div><div className="progress" style={{ marginTop: 7 }}><div className="progress-fill" style={{ width: `${pct}%`, background: color }} /></div></div><div style={{ textAlign: "right", flexShrink: 0 }}><div className="tabular" style={{ fontSize: "0.8125rem", fontWeight: 700, color }}>{fmt(product.stock)} L</div><div style={{ fontSize: "0.6875rem", color: "#94A3B8" }}>mín. {fmt(product.stockMin)} L</div></div></div>; })}
      </div>
      <div className="panel"><div className="panel-header"><span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0F172A" }}>Actividad reciente</span></div>{activity.map((item, index) => <div key={index} style={{ padding: "10px 18px", borderBottom: index < activity.length - 1 ? "1px solid #F1F5F9" : "none", display: "flex", alignItems: "flex-start", gap: 12 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: item.type === "alert" ? "#FEE2E2" : item.type === "invoice" ? "#DCFCE7" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico p={item.type === "alert" ? I.alert : item.type === "invoice" ? I.invoice : item.type === "quote" ? I.quotes : I.lots} size={13} /></div><p style={{ flex: 1, fontSize: "0.8125rem", color: "#1E293B" }}>{item.desc}</p><span style={{ fontSize: "0.6875rem", color: "#94A3B8", flexShrink: 0, fontFamily: "JetBrains Mono, monospace" }}>{item.time}</span></div>)}</div>
    </div>
  );
}
