import React from "react"

import { I, Ico } from "../shared"

export default function Login({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F1F5F9",
        padding: 24,
      }}
    >
      <div className="panel" style={{ width: 420, padding: 32 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 10,
            background: "#E6F5EE",
            color: "#00995A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <Ico p={I.lock} size={24} />
        </div>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0F172A" }}>
          Inicio de sesión
        </h1>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "#64748B",
            marginTop: 4,
            marginBottom: 22,
          }}
        >
          Accede al sistema de gestión Ecoterra
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label className="label">Correo electrónico</label>
            <input
              className="input"
              type="email"
              placeholder="usuario@ecoterra.cl"
            />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <button
            className="btn btn-primary"
            style={{ justifyContent: "center", marginTop: 6 }}
            onClick={onEnter}
          >
            <Ico p={I.check} size={14} /> Ingresar
          </button>
        </div>
        <p
          style={{
            fontSize: "0.6875rem",
            color: "#94A3B8",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Prototipo visual · autenticación pendiente
        </p>
      </div>
    </div>
  )
}
