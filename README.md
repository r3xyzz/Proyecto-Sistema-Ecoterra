<div align="center">

# 🌍 EcoTerra — Sistema de Gestión Operativa, Facturación e Inteligencia Artificial

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)][cite: 1]
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)][cite: 1]
[![Django REST](https://img.shields.io/badge/Backend-Django_REST_Framework-092E20?style=for-the-badge&logo=django&logoColor=white)][cite: 1]
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)][cite: 1]
[![Scikit-Learn](https://img.shields.io/badge/AI/ML-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)][cite: 1]
[![Python](https://img.shields.io/badge/Language-Python_3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)][cite: 1]

<p align="center">
  <b>Sistema integral para la centralización de clientes, inventario, cotizaciones, facturación y análisis predictivo en el control de polvo y estabilización de caminos.</b>
</p>

[📌 Descripción General](#-descripción-general) •
[✨ Módulos y Funcionalidades](#-módulos-y-funcionalidades) •
[🤖 Modelos de Inteligencia Artificial](#-modelos-de-inteligencia-artificial) •
[🏗️ Arquitectura](#️-arquitectura-del-sistema) •
[🛠️ Stack Tecnológico](#️-stack-tecnológico) •
[🚀 Instalación y Despliegue](#-instalación-y-configuración) •
[👥 Equipo](#-equipo-de-desarrollo)

---

</div>

## 📌 Descripción General

**EcoTerra** es una empresa especializada en soluciones con polímeros para el control de polvo y la estabilización de caminos en áreas industriales y mineras. Parte de sus productos son adquiridos en Estados Unidos y trasladados a Chile vía transporte marítimo.

Este proyecto corresponde a un **Sistema de Gestión de Inventario, Cotizaciones, Facturación y Predicciones con IA**, diseñado para centralizar la operación logística y comercial, permitiendo una toma de decisiones informada basada en modelos analíticos.

> **Proyecto Capstone** — Ingeniería en Informática (Versión 1.1)

---

## ✨ Módulos y Funcionalidades

El sistema está estructurado en tres módulos clave:

### 📦 1. Gestión Operativa e Inventario
* **Clientes y Direcciones:** Registro de clientes y soporte para múltiples direcciones de despacho.
* **Productos y Lotes:** Control detallado de características, envases, ubicación y fechas de fabricación/vencimiento.
* **Control de Inventario:** Consulta de existencias en tiempo real y registro de movimientos de entrada, salida y ajuste.
* **Gestión de Proveedores:** Administración básica mediante operaciones CRUD.
* **Usuarios y Seguridad:** Control de acceso basado en roles y autenticación.

### 📄 2. Cotizaciones y Facturación
* **Ciclo Comercial:** Creación y consulta de cotizaciones, vinculación con Órdenes de Compra (OC) y generación de facturas.
* **Gestión de Documentos:** Emisión de facturas detalladas y notas de crédito asociadas.
* **Seguridad en PDFs:** Generación de documentos comerciales en PDF no editables con almacenamiento seguro.
* **Notificaciones:** Envío directo de cotizaciones y facturas por correo electrónico.

### 🧠 3. Módulo de Inteligencia Artificial
* Integración de modelos predictivos que actúan como apoyo analítico para la gestión comercial y la reposición de stock.

---

## 🤖 Modelos de Inteligencia Artificial

Desarrollados en **Python** utilizando **Scikit-Learn**, orientados al apoyo en la toma de decisiones:

| Modelo | Entradas (Features) | Salida (Target) | Propósito |
| :--- | :--- | :--- | :--- |
| **⏱️ Tiempo de Llegada** | Puerto de origen, Naviera, Tipo de carga, Mes | Días estimados de arribo[cite: 1] | Estimar tiempos de traslado marítimo EE.UU. ➔ Chile[cite: 1]. |
| **💰 Predicción de Precio** | Producto, Fecha, Cantidad[cite: 1] | Precio esperado ($)[cite: 1] | Proyectar variaciones de precios basadas en historial de ventas[cite: 1]. |
| **📊 Reposición de Stock** | Stock actual, Ventas promedio, Stock mínimo[cite: 1] | Días restantes antes del desabastecimiento[cite: 1] | Planificar compras y evitar quiebres de inventario[cite: 1]. |

---

## 🏗️ Arquitectura del Sistema

El sistema utiliza una arquitectura cliente-servidor por capas[cite: 1]:

```mermaid
graph TD
    A[Actor: Usuario / Operador] -->|HTTP / REST| B[Frontend: React + Tailwind CSS]
    B -->|API REST| C[Backend: Django REST Framework]
    C -->|Acceso a Datos| D[(BD: PostgreSQL)]
    C -->|Solicitud de Predicciones| E[Módulo IA: Scikit-Learn]
    E -->|Modelos| F1[Predicción Tiempo Llegada]
    E -->|Modelos| F2[Predicción Precio]
    E -->|Modelos| F3[Predicción Reposición Stock]
