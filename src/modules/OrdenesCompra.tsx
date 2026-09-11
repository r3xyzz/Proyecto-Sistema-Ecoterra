import React from "react"

import { Badge, fmtCLP, I, Ico, PageTitle } from "../shared"

type PurchaseOrder = {
  id: string
  cot: string
  cliente: string
  fecha: string
  total: number
  estado: string
  factura: string | null
}

export default function OrdenesCompra({
  ordenes,
}: {
  ordenes: PurchaseOrder[]
}) {
  return (
    <div>
      <PageTitle
        title="Órdenes de Compra"
        sub="OC recibidas de clientes y trazabilidad documental"
      />
      <div className="panel">
        <table className="dt w-full">
          <thead>
            <tr>
              <th>N° OC</th>
              <th>Cotización</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total (CLP)</th>
              <th>Factura</th>
              <th>Estado</th>
              <th>Archivo OC</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 700, color: "#0052CC" }}>
                  {order.id}
                </td>
                <td>{order.cot}</td>
                <td>{order.cliente}</td>
                <td>{order.fecha}</td>
                <td>{fmtCLP(order.total)}</td>
                <td>{order.factura ?? "—"}</td>
                <td>
                  <Badge t={order.estado === "Aprobada" ? "ok" : "info"}>
                    {order.estado}
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">
                    <Ico p={I.pdf} size={13} /> Vista previa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
