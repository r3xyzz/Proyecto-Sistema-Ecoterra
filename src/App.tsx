import React, { useState } from "react";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./modules/Dashboard";
import Clientes from "./modules/Clientes";
import Proveedores from "./modules/Proveedores";
import Productos from "./modules/Productos";
import Lotes from "./modules/Lotes";
import Movimientos from "./modules/Movimientos";
import Cotizaciones from "./modules/Cotizaciones";
import OrdenesCompra from "./modules/OrdenesCompra";
import Facturacion from "./modules/Facturacion";
import NotasCredito from "./modules/NotasCredito";
import IaPanel from "./modules/IaPanel";
import { Screen } from "./shared";

const productos = [
  { id: 1, codigo: "POL-001", nombre: "EcoStab Polímero Estabilizador 500L", desc: "Estabilización de suelos y caminos no pavimentados.", tipo: "Estabilización", unidad: "Litros", stockMin: 600, stock: 2960 },
  { id: 2, codigo: "POL-002", nombre: "EcoDust Control Supresor de Polvo 25L", desc: "Supresión de polvo en caminos mineros y vías de acarreo.", tipo: "Control Polvo", unidad: "Litros", stockMin: 1000, stock: 300 },
  { id: 3, codigo: "POL-003", nombre: "EcoMine Heavy Duty 1000L", desc: "Polímero de alta resistencia para operaciones mineras.", tipo: "Minería", unidad: "Litros", stockMin: 2000, stock: 0 },
  { id: 4, codigo: "POL-004", nombre: "EcoRoad Concentrado Plus 200L", desc: "Concentrado 50X para caminos secundarios y accesos viales.", tipo: "Vialidad", unidad: "Litros", stockMin: 400, stock: 1340 },
  { id: 5, codigo: "POL-005", nombre: "EcoAgroPol Aplicación Agrícola 25L", desc: "Polímero para suelos agrícolas en zonas áridas.", tipo: "Agrícola", unidad: "Litros", stockMin: 800, stock: 200 },
];
const clientes = [{ id: 1, rut: "76.234.567-8", razon: "Minera Los Bronces S.A.", fantasia: "Los Bronces", ciudad: "Santiago", tel: "+56 2 2345 6789", email: "compras@losbronces.cl", rep: "Carlos Muñoz", estado: "Activo", dirs: [] }, { id: 2, rut: "77.891.234-5", razon: "Constructora Vial Sur Ltda.", fantasia: "Vial Sur", ciudad: "Concepción", tel: "+56 41 223 4567", email: "logistica@vialsur.cl", rep: "Ana Rodríguez", estado: "Activo", dirs: [] }];
const lotes = [
  { id: "LT-2024-001", prod: "POL-001", batch: "B240115", qty: 1200, envase: "IBC 1000 L", fabr: "2024-01-15", venc: "2026-01-14", ubic: "A1-01", estado: "Disponible" },
  { id: "LT-2024-002", prod: "POL-001", batch: "B240320", qty: 1760, envase: "Tambor 200 L", fabr: "2024-03-20", venc: "2026-03-19", ubic: "A1-02", estado: "Disponible" },
  { id: "LT-2024-003", prod: "POL-002", batch: "B240210", qty: 300, envase: "Tambor 200 L", fabr: "2024-02-10", venc: "2025-08-09", ubic: "B2-03", estado: "Reservado" },
  { id: "LT-2024-004", prod: "POL-003", batch: "B240401", qty: 0, envase: "IBC 1000 L", fabr: "2024-04-01", venc: "2026-03-31", ubic: "A2-01", estado: "Disponible" },
  { id: "LT-2024-005", prod: "POL-004", batch: "B240512", qty: 1340, envase: "Tambor 200 L", fabr: "2024-05-12", venc: "2026-05-11", ubic: "C3-02", estado: "Disponible" },
  { id: "LT-2024-006", prod: "POL-005", batch: "B240603", qty: 200, envase: "Tambor 200 L", fabr: "2024-06-03", venc: "2025-06-02", ubic: "B3-04", estado: "Disponible" },
];
const cotizaciones = [
  { id: "COT-2024-041", cliente: "Minera Los Bronces S.A.", fecha: "2024-06-10", vigencia: "2024-07-10", total: 4250000, estado: "Vigente", oc: null, factura: null },
  { id: "COT-2024-040", cliente: "Constructora Vial Sur Ltda.", fecha: "2024-06-05", vigencia: "2024-07-05", total: 1840000, estado: "Convertida", oc: "OC-2024-040", factura: "FAC-2024-121" },
  { id: "COT-2024-039", cliente: "Portuaria del Pacífico", fecha: "2024-05-28", vigencia: "2024-06-28", total: 7680000, estado: "Vencida", oc: null, factura: null },
  { id: "COT-2024-038", cliente: "Agrícola Atacama SpA", fecha: "2024-05-20", vigencia: "2024-06-20", total: 570000, estado: "Vigente", oc: "OC-2024-038", factura: null },
];
const facturas = [
  { id: "FAC-2024-122", oc: "OC-2024-041", cliente: "Minera Los Bronces S.A.", fecha: "2024-06-12", venc: "2024-07-12", subtotal: 3571429, iva: 678571, total: 4250000, estado: "Pendiente" },
  { id: "FAC-2024-121", oc: "OC-2024-040", cliente: "Constructora Vial Sur Ltda.", fecha: "2024-06-06", venc: "2024-07-06", subtotal: 1546218, iva: 293782, total: 1840000, estado: "Pagada" },
  { id: "FAC-2024-120", oc: "OC-2024-039", cliente: "Portuaria del Pacífico", fecha: "2024-05-30", venc: "2024-06-30", subtotal: 6453782, iva: 1226218, total: 7680000, estado: "Vencida" },
];
const ordenes = [
  { id: "OC-2024-041", cot: "COT-2024-040", cliente: "Constructora Vial Sur Ltda.", fecha: "2024-06-06", total: 1840000, estado: "Aprobada", factura: "FAC-2024-121" },
  { id: "OC-2024-040", cot: "COT-2024-038", cliente: "Agrícola Atacama SpA", fecha: "2024-05-25", total: 570000, estado: "Pendiente facturar", factura: null },
  { id: "OC-2024-039", cot: "COT-2024-039", cliente: "Portuaria del Pacífico", fecha: "2024-06-02", total: 7680000, estado: "En despacho", factura: null },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const views: Record<Screen, React.ReactNode> = {
    dashboard: <Dashboard productos={productos} onNav={setScreen} />, clientes: <Clientes clientes={clientes} />, proveedores: <Proveedores />, productos: <Productos productos={productos} />, lotes: <Lotes lotes={lotes} />, movimientos: <Movimientos productos={productos} lotes={lotes} />, cotizaciones: <Cotizaciones cotizaciones={cotizaciones} />, oc: <OrdenesCompra ordenes={ordenes} />, facturacion: <Facturacion facturas={facturas} />, nc: <NotasCredito facturas={facturas} />, ia: <IaPanel productos={productos} />,
  };
  return <AppLayout screen={screen} onNav={setScreen}>{views[screen]}</AppLayout>;
}
