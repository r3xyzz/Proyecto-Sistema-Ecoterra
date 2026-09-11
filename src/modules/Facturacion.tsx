import React, { useState } from "react"

import { Badge, fmtCLP, I, Ico, PageTitle } from "../shared"

type Invoice = {
  id: string
  oc: string
  cliente: string
  fecha: string
  venc: string
  subtotal: number
  iva: number
  total: number
  estado: string
}

export default function Facturacion({ facturas }: { facturas: Invoice[] }) {
  const [preview, setPreview] = useState<Invoice | null>(null)

  return (
    <div>
      <PageTitle
        title="Facturación"
        sub="Documentos tributarios electrónicos 1:1 con OC"
      >
        <button className="btn btn-primary">
          <Ico p={I.plus} size={14} /> Nueva factura
        </button>
      </PageTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div className="kpi">
          <div className="kpi-label">Total facturado (mes)</div>
          <div className="kpi-value tabular">{fmtCLP(13_770_000)}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Pagadas</div>
          <div className="kpi-value tabular">
            {facturas.filter((invoice) => invoice.estado === "Pagada").length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value tabular" style={{ color: "#B45309" }}>
            {
              facturas.filter((invoice) => invoice.estado === "Pendiente")
                .length
            }
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Vencidas</div>
          <div className="kpi-value tabular" style={{ color: "#DC2626" }}>
            {facturas.filter((invoice) => invoice.estado === "Vencida").length}
          </div>
        </div>
      </div>
      <div className="panel">
        <table className="dt w-full">
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>OC</th>
              <th>Cliente</th>
              <th>Emisión</th>
              <th>Vencimiento</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total (CLP)</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((invoice) => (
              <tr key={invoice.id}>
                <td style={{ fontWeight: 700, color: "#0052CC" }}>
                  {invoice.id}
                </td>
                <td>{invoice.oc}</td>
                <td style={{ fontWeight: 600 }}>{invoice.cliente}</td>
                <td>{invoice.fecha}</td>
                <td>{invoice.venc}</td>
                <td>{fmtCLP(invoice.subtotal)}</td>
                <td>{fmtCLP(invoice.iva)}</td>
                <td style={{ fontWeight: 700 }}>{fmtCLP(invoice.total)}</td>
                <td>
                  <Badge
                    t={
                      invoice.estado === "Pagada"
                        ? "ok"
                        : invoice.estado === "Vencida"
                          ? "danger"
                          : "warn"
                    }
                  >
                    {invoice.estado}
                  </Badge>
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    title="Ver factura"
                    onClick={() => setPreview(invoice)}
                  >
                    <Ico p={I.pdf} size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div
            className="modal"
            style={{ width: 640, padding: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div>
                <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
                  Vista Previa — {preview.id}
                </h2>
                <p style={{ fontSize: "0.75rem", color: "#64748B" }}>
                  Documento electrónico · No editable
                </p>
              </div>
              <button
                onClick={() => setPreview(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Ico p={I.x} size={18} />
              </button>
            </div>
            <div style={{ border: "1px solid #E2E8F0", padding: 28 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #00995A",
                  paddingBottom: 16,
                  marginBottom: 20,
                }}
              >
                <strong style={{ color: "#00995A", fontSize: "1.2rem" }}>
                  Ecoterra
                </strong>
                <strong>{preview.id}</strong>
              </div>
              <p style={{ fontWeight: 700 }}>{preview.cliente}</p>
              <p style={{ color: "#64748B", marginTop: 6 }}>
                OC {preview.oc} · Emisión {preview.fecha} · Vence {preview.venc}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 36,
                  borderTop: "1px solid #E2E8F0",
                  paddingTop: 14,
                  fontWeight: 700,
                }}
              >
                <span>TOTAL CLP</span>
                <span>{fmtCLP(preview.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
