import React, { useState } from "react"
import { I, Ico } from "../shared"

export type AuthUser = {
  id: number
  nombre: string
  email: string
  rol: string
  estado: string
}

type Props = {
  onEnter: (user: AuthUser) => void
}

export default function Login({ onEnter }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Correo y contraseña son obligatorios.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || "Credenciales inválidas.")
      }

      const user: AuthUser = await res.json()
      onEnter(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <form className="panel login-panel" onSubmit={handleSubmit}>
        <div className="login-lock">
          <Ico p={I.lock} size={24} />
        </div>
        <h1 className="login-title">Inicio de sesión</h1>
        <p className="login-subtitle">Accede al sistema de gestión Ecoterra</p>

        {error && (
          <p style={{ color: "#b91c1c", marginBottom: 12, textAlign: "center" }}>
            {error}
          </p>
        )}

        <div className="login-form">
          <div className="field">
            <label className="label">Correo electrónico</label>
            <input
              className="input"
              type="email"
              placeholder="usuario@ecoterra.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <button
            className="btn btn-primary login-button"
            type="submit"
            disabled={loading}
          >
            <Ico p={I.check} size={14} />
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </div>
        <p className="login-footer">
          Ingresa con tu correo y contraseña registrados
        </p>
      </form>
    </div>
  )
}