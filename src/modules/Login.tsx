import React from "react"
import { I, Ico } from "../shared"

export default function Login({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="login-screen">
      <div className="panel login-panel">
        <div className="login-lock">
          <Ico p={I.lock} size={24} />
        </div>
        <h1 className="login-title">
          Inicio de sesión
        </h1>
        <p className="login-subtitle">
          Accede al sistema de gestión Ecoterra
        </p>
        <div className="login-form">
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
            className="btn btn-primary login-button"
            onClick={onEnter}
          >
            <Ico p={I.check} size={14} /> Ingresar
          </button>
        </div>
        <p className="login-footer">
          Prototipo visual · autenticación pendiente
        </p>
      </div>
    </div>
  )
}
