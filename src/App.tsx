// App.tsx
import React, { useEffect, useState } from "react"
import AppLayout from "./layout/AppLayout"
import Dashboard from "./modules/Dashboard"
import Clientes, { Address, AddressInput, Client, NewClientInput } from "./modules/Clientes"
import Proveedores, { Proveedor, ProveedorInput } from "./modules/Proveedores"
import Productos, { ProductInput } from "./modules/Productos"
import Lotes, { Lote, LoteInput } from "./modules/Lotes"
import Movimientos, { Movimiento, MovimientoInput } from "./modules/Movimientos"
import Cotizaciones from "./modules/Cotizaciones"
import OrdenesCompra from "./modules/OrdenesCompra"
import Facturacion from "./modules/Facturacion"
import NotasCredito from "./modules/NotasCredito"
import IaPanel from "./modules/IaPanel"
import Login, { AuthUser } from "./modules/Login"
import Usuarios, { User, UserInput } from "./modules/Usuarios"
import { Screen } from "./shared"

// ---------- Mappers API -> UI ----------
const mapClientFromApi = (item: any) => ({
  id: item.id,
  rut: item.rut,
  razon: item.razon_social,
  fantasia: item.nombre_fantasia || item.razon_social,
  ciudad: item.ciudad,
  tel: item.telefono || "-",
  email: item.email || "-",
  rep: item.representante || "-",
  estado: item.estado,
  dirs: Array.isArray(item.direcciones) ? item.direcciones : [],
})

const mapProductFromApi = (item: any) => ({
  id: item.id,
  codigo: item.codigo,
  nombre: item.nombre,
  desc: item.descripcion || "",
  tipo: item.tipo,
  unidad: item.unidad,
  stockMin: Number(item.stock_minimo),
  stock: Number(item.stock),
  estado: item.estado ? "Activo" : "Inactivo",
})

const mapUserFromApi = (item: any): User => ({
  id: item.id,
  nombre: item.nombre,
  email: item.email,
  rol: item.rol || "Usuario base",
  estado: item.estado || "Activo",
  permisos:
    typeof item.permisos === "object" && item.permisos !== null
      ? item.permisos
      : undefined,
})

const mapProveedorFromApi = (item: any): Proveedor => ({
  id: item.id,
  empresa: item.nombre_empresa,
  pais: item.pais,
  contacto: item.contacto,
  tel: item.telefono || "-",
  email: item.email || "-",
  direccion: item.direccion || "",
  estado:
    item.estado === "Activo" || item.estado === "Inactivo"
      ? item.estado
      : "Activo",
})

const mapLoteFromApi = (item: any, productos: any[]): Lote => {
  const producto = productos.find((p) => Number(p.id) === Number(item.id_producto))
  return {
    id: item.id,
    prod: producto?.codigo || String(item.id_producto),
    qty: Number(item.cantidad),
    envase: item.tipo_envase || "-",
    fabr: item.fecha_fabricacion || "",
    venc: item.fecha_vencimiento || "",
    ubic: item.ubicacion || "-",
    estado: item.estado || "Disponible",
  }
}

const mapMovimientoFromApi = (
  item: any,
  lotes: any[],
  usuarios: any[],
): Movimiento => {
  const lote = lotes.find((l) => Number(l.id) === Number(item.id_inventario))
  const usuario = usuarios.find((u) => Number(u.id) === Number(item.id_usuario))
  const fecha = item.fecha_movimiento
    ? new Date(item.fecha_movimiento).toISOString().slice(0, 16).replace("T", " ")
    : ""
  return {
    id: item.id,
    ts: fecha,
    tipo: item.tipo_movimiento,
    prod: lote?.prod || "—",
    qty: Number(item.cantidad_movimiento),
    lote: lote?.id ? String(lote.id) : "—",
    ref: item.referencia || "—",
    observacion: item.observacion || "",
    user: usuario?.nombre || "—",
  }
}


// ---------- Datos iniciales (fallback) ----------
const initialProductos = [
  {
    id: 1,
    codigo: "POL-001",
    nombre: "EcoStab Polímero Estabilizador 500L",
    desc: "Estabilización de suelos y caminos no pavimentados.",
    tipo: "Estabilización",
    unidad: "Litros",
    stockMin: 600,
    stock: 2960,
    estado: "Activo",
  },
  {
    id: 2,
    codigo: "POL-002",
    nombre: "EcoDust Control Supresor de Polvo 25L",
    desc: "Supresión de polvo en caminos mineros y vías de acarreo.",
    tipo: "Control Polvo",
    unidad: "Litros",
    stockMin: 1000,
    stock: 300,
    estado: "Activo",
  },
  {
    id: 3,
    codigo: "POL-003",
    nombre: "EcoMine Heavy Duty 1000L",
    desc: "Polímero de alta resistencia para operaciones mineras.",
    tipo: "Minería",
    unidad: "Litros",
    stockMin: 2000,
    stock: 0,
    estado: "Inactivo",
  },
  {
    id: 4,
    codigo: "POL-004",
    nombre: "EcoRoad Concentrado Plus 200L",
    desc: "Concentrado 50X para caminos secundarios y accesos viales.",
    tipo: "Vialidad",
    unidad: "Litros",
    stockMin: 400,
    stock: 1340,
    estado: "Activo",
  },
  {
    id: 5,
    codigo: "POL-005",
    nombre: "EcoAgroPol Aplicación Agrícola 25L",
    desc: "Polímero para suelos agrícolas en zonas áridas.",
    tipo: "Agrícola",
    unidad: "Litros",
    stockMin: 800,
    stock: 200,
    estado: "Activo",
  },
]

const cotizaciones = [
  {
    id: "COT-2024-041",
    cliente: "Minera Los Bronces S.A.",
    fecha: "2024-06-10",
    vigencia: "2024-07-10",
    subtotal: 3571429,
    iva: 678571,
    total: 4250000,
    observacion: "Entrega estimada en dos despachos según disponibilidad de bodega.",
    estado: "Vigente",
  },
  {
    id: "COT-2024-040",
    cliente: "Constructora Vial Sur Ltda.",
    fecha: "2024-06-05",
    vigencia: "2024-07-05",
    subtotal: 1546218,
    iva: 293782,
    total: 1840000,
    observacion: "Precios sujetos a confirmación de volumen.",
    estado: "Convertida",
  },
  {
    id: "COT-2024-039",
    cliente: "Portuaria del Pacífico",
    fecha: "2024-05-28",
    vigencia: "2024-06-28",
    subtotal: 6453782,
    iva: 1226218,
    total: 7680000,
    observacion: "Considerar coordinación previa con el área de operaciones.",
    estado: "Vencida",
  },
  {
    id: "COT-2024-038",
    cliente: "Agrícola Atacama SpA",
    fecha: "2024-05-20",
    vigencia: "2024-06-20",
    subtotal: 478992,
    iva: 91008,
    total: 570000,
    observacion: "Despacho a confirmar con el cliente.",
    estado: "Vigente",
  },
]

const facturas = [
  {
    id: "FAC-2024-122",
    oc: "OC-2024-041",
    cliente: "Minera Los Bronces S.A.",
    fecha: "2024-06-12",
    venc: "2024-07-12",
    subtotal: 3571429,
    iva: 678571,
    total: 4250000,
    estado: "Pendiente",
  },
  {
    id: "FAC-2024-121",
    oc: "OC-2024-040",
    cliente: "Constructora Vial Sur Ltda.",
    fecha: "2024-06-06",
    venc: "2024-07-06",
    subtotal: 1546218,
    iva: 293782,
    total: 1840000,
    estado: "Pagada",
  },
  {
    id: "FAC-2024-120",
    oc: "OC-2024-039",
    cliente: "Portuaria del Pacífico",
    fecha: "2024-05-30",
    venc: "2024-06-30",
    subtotal: 6453782,
    iva: 1226218,
    total: 7680000,
    estado: "Vencida",
  },
]

const ordenes = [
  {
    id: "OC-2024-041",
    cot: "COT-2024-040",
    cliente: "Constructora Vial Sur Ltda.",
    fecha: "2024-06-06",
    total: 1840000,
    estado: "Aprobada",
    factura: "FAC-2024-121",
  },
  {
    id: "OC-2024-040",
    cot: "COT-2024-038",
    cliente: "Agrícola Atacama SpA",
    fecha: "2024-05-25",
    total: 570000,
    estado: "Pendiente facturar",
    factura: null,
  },
  {
    id: "OC-2024-039",
    cot: "COT-2024-039",
    cliente: "Portuaria del Pacífico",
    fecha: "2024-06-02",
    total: 7680000,
    estado: "En despacho",
    factura: null,
  },
]

// ---------- App ----------
export default function App() {
  // Sesión persistida en localStorage
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)


  const [screen, setScreen] = useState<Screen>("login")
  const [productos, setProductos] = useState(initialProductos)
  const [clientes, setClientes] = useState<
    React.ComponentProps<typeof Clientes>["clientes"]
  >([])
  const [clientesError, setClientesError] = useState("")
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [usuariosError, setUsuariosError] = useState("")
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [proveedoresError, setProveedoresError] = useState("")
  const [lotes, setLotes] = useState<Lote[]>([])
  const [lotesError, setLotesError] = useState("")
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [movimientosError, setMovimientosError] = useState("")

  // ---------- Auth ----------
    const handleLogin = (user: AuthUser) => {
    setAuthUser(user)
    setScreen("dashboard")
  }

  const handleLogout = () => {
    setAuthUser(null)
    setScreen("login")
  }

  // ---------- Cargas iniciales (solo si hay sesión) ----------
  useEffect(() => {
    if (!authUser) return
    fetch("/api/clientes/")
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar clientes")
        return r.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Formato inválido")
        setClientes(data.map(mapClientFromApi))
        setClientesError("")
      })
      .catch((error) => {
        setClientes([])
        setClientesError(
          error instanceof Error
            ? `${error.message}. Verifica que Django esté conectado a Supabase.`
            : "No se pudieron cargar los clientes.",
        )
      })
  }, [authUser])

  useEffect(() => {
    if (!authUser) return
    fetch("/api/usuarios/")
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar usuarios")
        return r.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Formato inválido")
        setUsuarios(data.map(mapUserFromApi))
        setUsuariosError("")
      })
      .catch((error) => {
        setUsuarios([])
        setUsuariosError(
          error instanceof Error
            ? `${error.message}. Verifica que Django esté conectado a Supabase.`
            : "No se pudieron cargar los usuarios.",
        )
      })
  }, [authUser])

  useEffect(() => {
    if (!authUser) return
    fetch("/api/proveedores/")
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar proveedores")
        return r.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Formato inválido")
        setProveedores(data.map(mapProveedorFromApi))
        setProveedoresError("")
      })
      .catch((error) => {
        setProveedores([])
        setProveedoresError(
          error instanceof Error
            ? `${error.message}. Verifica que Django esté conectado a Supabase.`
            : "No se pudieron cargar los proveedores.",
        )
      })
  }, [authUser])

  // Cargar productos + lotes (en cadena porque lotes dependen de productos)
  useEffect(() => {
    if (!authUser) return

    fetch("/api/productos/")
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar productos")
        return r.json()
      })
      .then((productosData) => {
        const mappedProductos = Array.isArray(productosData)
          ? productosData.map(mapProductFromApi)
          : initialProductos
        setProductos(mappedProductos)

        // Cargar lotes en cadena
        return fetch("/api/inventario/")
          .then((r) => {
            if (!r.ok) throw new Error("No se pudo cargar inventario")
            return r.json()
          })
          .then((lotesData) => {
            if (!Array.isArray(lotesData)) throw new Error("Formato inválido")
            setLotes(lotesData.map((l: any) => mapLoteFromApi(l, mappedProductos)))
            setLotesError("")
          })
      })
      .catch((error) => {
        setProductos(initialProductos)
        setLotes([])
        setLotesError(
          error instanceof Error
            ? `${error.message}. Verifica que Django esté conectado a Supabase.`
            : "No se pudieron cargar los lotes.",
        )
      })
  }, [authUser])

  // Cargar movimientos (depende de lotes y usuarios para enriquecer)
  useEffect(() => {
    if (!authUser) return

    fetch("/api/movimientos/")
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar movimientos")
        return r.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Formato inválido")
        setMovimientos(data.map((m: any) => mapMovimientoFromApi(m, lotes, usuarios)))
        setMovimientosError("")
      })
      .catch((error) => {
        setMovimientos([])
        setMovimientosError(
          error instanceof Error
            ? `${error.message}. Verifica que Django esté conectado a Supabase.`
            : "No se pudieron cargar los movimientos.",
        )
      })
  }, [authUser, lotes, usuarios])

  // ---------- Handlers Usuarios ----------
  const createUser = async (input: UserInput) => {
    const response = await fetch("/api/usuarios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: input.nombre,
        email: input.email,
        rol: input.rol,
        estado: input.estado,
        permisos: input.permisos ?? {},
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo guardar el usuario",
      )
    }
    const created = mapUserFromApi(await response.json())
    setUsuarios((current) => [...current, created])
    return created
  }

  const updateUser = async (user: User, input: UserInput) => {
    const response = await fetch(`/api/usuarios/${user.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: input.nombre,
        email: input.email,
        rol: input.rol,
        estado: input.estado,
        permisos: input.permisos ?? {},
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo actualizar el usuario",
      )
    }
    const updated = mapUserFromApi(await response.json())
    setUsuarios((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    )
    return updated
  }

  const deleteUser = async (user: User) => {
    const response = await fetch(`/api/usuarios/${user.id}/`, { method: "DELETE" })
    if (!response.ok) throw new Error("No se pudo eliminar el usuario")
    setUsuarios((current) => current.filter((item) => item.id !== user.id))
  }

  // ---------- Handlers Proveedores ----------
  const proveedorPayload = (input: ProveedorInput) => ({
    nombre_empresa: input.empresa,
    pais: input.pais,
    contacto: input.contacto,
    telefono: input.tel,
    email: input.email,
    direccion: input.direccion,
    estado: input.estado,
  })

  const createProveedor = async (input: ProveedorInput) => {
    const response = await fetch("/api/proveedores/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedorPayload(input)),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo guardar el proveedor",
      )
    }
    const created = mapProveedorFromApi(await response.json())
    setProveedores((current) => [...current, created])
    return created
  }

  const updateProveedor = async (proveedor: Proveedor, input: ProveedorInput) => {
    const response = await fetch(`/api/proveedores/${proveedor.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedorPayload(input)),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo actualizar el proveedor",
      )
    }
    const updated = mapProveedorFromApi(await response.json())
    setProveedores((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    )
    return updated
  }

  const deleteProveedor = async (proveedor: Proveedor) => {
    const response = await fetch(`/api/proveedores/${proveedor.id}/`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("No se pudo eliminar el proveedor")
    setProveedores((current) => current.filter((item) => item.id !== proveedor.id))
  }

  // ---------- Handlers Clientes ----------
  const createClient = async (input: NewClientInput) => {
    const response = await fetch("/api/clientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rut: input.rut,
        razon_social: input.razon_social,
        nombre_fantasia: input.nombre_fantasia,
        ciudad: input.ciudad,
        telefono: input.telefono,
        email: input.email,
        representante: input.representante,
        estado: input.estado,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo guardar el cliente",
      )
    }
    const created = mapClientFromApi(await response.json())
    setClientes((current) => [...current, created])
    return created
  }

  const updateClient = async (client: Client, input: NewClientInput) => {
    const response = await fetch(`/api/clientes/${client.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rut: input.rut,
        razon_social: input.razon_social,
        nombre_fantasia: input.nombre_fantasia,
        ciudad: input.ciudad,
        telefono: input.telefono,
        email: input.email,
        representante: input.representante,
        estado: input.estado,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo actualizar el cliente",
      )
    }
    const updated = mapClientFromApi(await response.json())
    setClientes((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    )
    return updated
  }

  const deleteClient = async (
    client: React.ComponentProps<typeof Clientes>["clientes"][number],
  ) => {
    const response = await fetch(`/api/clientes/${client.id}/`, { method: "DELETE" })
    if (!response.ok) throw new Error("No se pudo eliminar el cliente")
    setClientes((current) => current.filter((item) => item.id !== client.id))
  }

  const createAddress = async (client: Client, input: AddressInput) => {
    const response = await fetch(`/api/clientes/${client.id}/direcciones/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo crear la dirección",
      )
    }
    const created = (await response.json()) as Address
    setClientes((current) =>
      current.map((item) =>
        item.id === client.id ? { ...item, dirs: [...item.dirs, created] } : item,
      ),
    )
    return created
  }

  const updateAddress = async (client: Client, address: Address, input: AddressInput) => {
    const response = await fetch(
      `/api/clientes/${client.id}/direcciones/${address.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo actualizar la dirección",
      )
    }
    const updated = (await response.json()) as Address
    setClientes((current) =>
      current.map((item) =>
        item.id === client.id
          ? {
              ...item,
              dirs: item.dirs.map((a) => (a.id === updated.id ? updated : a)),
            }
          : item,
      ),
    )
    return updated
  }

  const deleteAddress = async (client: Client, address: Address) => {
    const response = await fetch(
      `/api/clientes/${client.id}/direcciones/${address.id}/`,
      { method: "DELETE" },
    )
    if (!response.ok) throw new Error("No se pudo eliminar la dirección")
    setClientes((current) =>
      current.map((item) =>
        item.id === client.id
          ? { ...item, dirs: item.dirs.filter((a) => a.id !== address.id) }
          : item,
      ),
    )
  }

  // ---------- Handlers Productos ----------
  const productPayload = (input: ProductInput) => ({
    codigo: input.codigo,
    nombre: input.nombre,
    descripcion: input.descripcion,
    tipo: input.tipo,
    unidad: input.unidad,
    stock_minimo: input.stockMinimo,
  })

  const createProduct = async (input: ProductInput) => {
    const response = await fetch("/api/productos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productPayload(input)),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo crear el producto",
      )
    }
    const created = mapProductFromApi(await response.json())
    setProductos((current) => [...current, created])
    return created
  }

  const updateProduct = async (
    product: React.ComponentProps<typeof Productos>["productos"][number],
    input: ProductInput,
  ) => {
    const response = await fetch(`/api/productos/${product.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productPayload(input)),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo actualizar el producto",
      )
    }
    const updated = mapProductFromApi(await response.json())
    setProductos((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    )
    return updated
  }

  const deleteProduct = async (
    product: React.ComponentProps<typeof Productos>["productos"][number],
  ) => {
    const response = await fetch(`/api/productos/${product.id}/`, { method: "DELETE" })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo eliminar el producto",
      )
    }
    setProductos((current) => current.filter((item) => item.id !== product.id))
  }

  // ---------- Handlers Lotes ----------
  const createLote = async (input: LoteInput) => {
    // Buscar id_producto real a partir del código
    const producto = productos.find((p: any) => p.codigo === input.prod)
    if (!producto) throw new Error("Producto no encontrado")

    const response = await fetch("/api/inventario/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_producto: producto.id,
        cantidad: input.qty,
        tipo_envase: input.envase || "Tambor 200 L",
        fecha_fabricacion: input.fabr,
        fecha_vencimiento: input.venc,
        ubicacion: input.ubic || "",
        estado: input.estado || "Disponible",
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData
          ? Object.values(errorData).flat().join(" ")
          : "No se pudo crear el lote",
      )
    }
    const created = mapLoteFromApi(await response.json(), productos)
    setLotes((current) => [...current, created])
    return created
  }

  const deleteLote = async (lote: Lote) => {
    const response = await fetch(`/api/inventario/${lote.id}/`, { method: "DELETE" })
    if (!response.ok) throw new Error("No se pudo eliminar el lote")
    setLotes((current) => current.filter((item) => item.id !== lote.id))
  }

  // ---------- Handlers Movimientos ----------
  const createMovimiento = async (input: MovimientoInput) => {
    const response = await fetch("/api/movimientos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_inventario: input.id_inventario,
        id_usuario: input.id_usuario,
        tipo_movimiento: input.tipo,
        cantidad_movimiento: input.cantidad_movimiento,
        referencia: input.referencia || null,
        observacion: input.observacion || null,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.detail ||
          (errorData ? Object.values(errorData).flat().join(" ") : "No se pudo registrar el movimiento"),
      )
    }
    const raw = await response.json()
    const created = mapMovimientoFromApi(raw, lotes, usuarios)
    setMovimientos((current) => [created, ...current])

    // Refrescar lotes para reflejar cambio de cantidad
    fetch("/api/inventario/")
      .then((r) => r.json())
      .then((lotesData) => {
        if (Array.isArray(lotesData)) {
          setLotes(lotesData.map((l: any) => mapLoteFromApi(l, productos)))
        }
      })
      .catch(() => {})

    return created
  }

  // ---------- Vistas ----------
  const views: Record<Screen, React.ReactNode> = {
    dashboard: <Dashboard productos={productos} onNav={setScreen} />,
    clientes: (
      <Clientes
        clientes={clientes}
        loadError={clientesError}
        onCreate={createClient}
        onDelete={deleteClient}
        onUpdate={updateClient}
        onCreateAddress={createAddress}
        onUpdateAddress={updateAddress}
        onDeleteAddress={deleteAddress}
      />
    ),
    proveedores: (
      <Proveedores
        proveedores={proveedores}
        loadError={proveedoresError}
        onCreate={createProveedor}
        onUpdate={updateProveedor}
        onDelete={deleteProveedor}
      />
    ),
    productos: (
      <Productos
        productos={productos}
        onCreate={createProduct}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
      />
    ),
    lotes: (
      <Lotes
        lotes={lotes}
        productos={productos}
        loadError={lotesError}
        onCreate={createLote}
        onDelete={deleteLote}
      />
    ),
    movimientos: (
      <Movimientos
        productos={productos}
        lotes={lotes}
        movimientos={movimientos}
        usuarioId={authUser?.id ?? 0}
        loadError={movimientosError}
        onCreate={createMovimiento}
      />
    ),
    cotizaciones: (
      <Cotizaciones
        cotizaciones={cotizaciones}
        ordenes={ordenes}
        facturas={facturas}
        clientes={clientes}
        productos={productos}
      />
    ),
    oc: <OrdenesCompra ordenes={ordenes} facturas={facturas} />,
    facturacion: <Facturacion facturas={facturas} />,
    nc: <NotasCredito facturas={facturas} />,
    ia: <IaPanel productos={productos} />,
    usuarios: (
      <Usuarios
        usuarios={usuarios}
        loadError={usuariosError}
        onCreate={createUser}
        onDelete={deleteUser}
        onUpdate={updateUser}
      />
    ),
    login: <Login onEnter={handleLogin} />,
  }

  if (!authUser) {
    return <Login onEnter={handleLogin} />
  }

  return (
  <AppLayout
    screen={screen}
    onNav={setScreen}
    user={authUser}
    onLogout={handleLogout}
  >
    {views[screen]}
  </AppLayout>
)
}