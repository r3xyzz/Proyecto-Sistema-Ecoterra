-- =====================================================================
-- MODELO DE BASE DE DATOS - Sistema de Inventario, Cotización y
-- Facturación Ecoterra
-- =====================================================================

DROP SCHEMA IF EXISTS ecoterra CASCADE;
CREATE SCHEMA ecoterra;
SET search_path TO ecoterra;

-- =====================================================================
-- 1. ROL
-- =====================================================================
CREATE TABLE rol (
    id_rol              SERIAL PRIMARY KEY,
    nombre_rol          VARCHAR(50)     NOT NULL,
    descripcion_rol     VARCHAR(255),
    activo_rol          BOOLEAN         NOT NULL DEFAULT TRUE
);

-- =====================================================================
-- 2. PERMISO
-- =====================================================================
CREATE TABLE permiso (
    id_permiso          SERIAL PRIMARY KEY,
    nombre_permiso      VARCHAR(100)    NOT NULL,
    modulo_permiso      VARCHAR(100)    NOT NULL,
    descripcion_permiso VARCHAR(255),
    activo_permiso      BOOLEAN         NOT NULL DEFAULT TRUE
);

-- =====================================================================
-- 3. ROL_PERMISO 
-- =====================================================================
CREATE TABLE rol_permiso (
    id_rol      INT NOT NULL,
    id_permiso  INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT fk_rp_rol FOREIGN KEY (id_rol)
        REFERENCES rol (id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permiso FOREIGN KEY (id_permiso)
        REFERENCES permiso (id_permiso) ON DELETE CASCADE
);

-- =====================================================================
-- 4. CLIENTE
-- =====================================================================
CREATE TABLE cliente (
    id_cliente              SERIAL PRIMARY KEY,
    rut_cliente             VARCHAR(12)     NOT NULL UNIQUE,
    razon_social_cliente    VARCHAR(150)    NOT NULL,
    nombre_fantasia_cliente VARCHAR(150),
    ciudad_cliente          VARCHAR(100)    NOT NULL,
    telefono_cliente        VARCHAR(20)     NOT NULL,
    correo_cliente          VARCHAR(150)    NOT NULL,
    representante_cliente   VARCHAR(100),
    estado_cliente          BOOLEAN         NOT NULL DEFAULT TRUE
);

-- =====================================================================
-- 5. DIRECCION 
-- =====================================================================
CREATE TABLE direccion (
    id_direccion                    SERIAL PRIMARY KEY,
    id_cliente                      INT             NOT NULL,
    nombre_direccion                VARCHAR(100)    NOT NULL,
    calle_direccion                 VARCHAR(100)    NOT NULL,
    ciudad_direccion                VARCHAR(100)    NOT NULL,
    region_direccion                VARCHAR(100)    NOT NULL,
    pais_direccion                  VARCHAR(100)    NOT NULL,
    codigo_postal_direccion         VARCHAR(20),
    tipo_direccion                  VARCHAR(50)     NOT NULL,
    contacto_recepcion_direccion    VARCHAR(100)    NOT NULL,
    telefono_contacto_direccion     VARCHAR(20)     NOT NULL,
    instrucciones_entrega_direccion TEXT,
    principal_direccion             BOOLEAN         NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_direccion_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente) ON DELETE CASCADE
);
CREATE INDEX idx_direccion_cliente ON direccion (id_cliente);

-- =====================================================================
-- 6. PROVEEDOR 
-- =====================================================================
CREATE TABLE proveedor (
    id_proveedor            SERIAL PRIMARY KEY,
    nombre_proveedor        VARCHAR(150)    NOT NULL,
    direccion_proveedor     VARCHAR(200)    NOT NULL,
    pais_proveedor          VARCHAR(100)    NOT NULL,
    correo_proveedor        VARCHAR(150)    NOT NULL,
    telefono_proveedor      VARCHAR(20)     NOT NULL,
    contacto_proveedor      VARCHAR(100)    NOT NULL
);

-- =====================================================================
-- 7. PRODUCTO
-- =====================================================================
CREATE TABLE producto (
    id_producto             SERIAL PRIMARY KEY,
    codigo_producto         VARCHAR(30)     NOT NULL UNIQUE,
    nombre_producto         VARCHAR(150)    NOT NULL,
    descripcion_producto    TEXT,
    tipo_producto           VARCHAR(100)    NOT NULL,
    unidad_medida_producto  VARCHAR(20)     NOT NULL,
    stock_minimo_producto   DECIMAL(10,2),
    activo_producto         BOOLEAN         NOT NULL DEFAULT TRUE
);

-- =====================================================================
-- 8. INVENTARIO 
-- =====================================================================
CREATE TABLE inventario (
    id_inventario                   SERIAL PRIMARY KEY,
    id_producto                     INT             NOT NULL,
    codigo_lote_inventario          VARCHAR(30),
    cantidad_inventario             DECIMAL(10,2)   NOT NULL CHECK (cantidad_inventario >= 0),
    tipo_envase_inventario          VARCHAR(30)     NOT NULL
        CHECK (tipo_envase_inventario IN ('Tambor 200 L', 'IBC 1000 L')),
    fecha_fabricacion_inventario    DATE            NOT NULL,
    fecha_vencimiento_inventario    DATE            NOT NULL,
    ubicacion_inventario            VARCHAR(30),
    estado_inventario               VARCHAR(30)     NOT NULL
        CHECK (estado_inventario IN ('Disponible', 'Reservado')),
    CONSTRAINT fk_inventario_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto) ON DELETE RESTRICT,
    CONSTRAINT chk_inventario_fechas CHECK (fecha_vencimiento_inventario > fecha_fabricacion_inventario)
);
CREATE INDEX idx_inventario_producto ON inventario (id_producto);

-- =====================================================================
-- 9. USUARIO 
-- =====================================================================
CREATE TABLE usuario (
    id_usuario          SERIAL PRIMARY KEY,
    id_rol              INT             NOT NULL,
    nombre_usuario      VARCHAR(100)    NOT NULL,
    correo_usuario      VARCHAR(150)    NOT NULL UNIQUE,
    contrasena_usuario  VARCHAR(255)    NOT NULL,
    activo_usuario      BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol)
        REFERENCES rol (id_rol) ON DELETE RESTRICT
);
CREATE INDEX idx_usuario_rol ON usuario (id_rol);

-- =====================================================================
-- 10. COTIZACION 
-- =====================================================================
CREATE TABLE cotizacion (
    id_cotizacion               SERIAL PRIMARY KEY,
    id_cliente                  INT             NOT NULL,
    numero_cotizacion           VARCHAR(30)     NOT NULL UNIQUE,
    fecha_cotizacion            DATE            NOT NULL,
    dias_vigencia_cotizacion    INT             NOT NULL CHECK (dias_vigencia_cotizacion > 0),
    vigencia_cotizacion         DATE            NOT NULL,
    condicion_pago_cotizacion   VARCHAR(30)     NOT NULL,
    subtotal_cotizacion         DECIMAL(12,2)   NOT NULL,
    iva_cotizacion              DECIMAL(12,2)   NOT NULL,
    total_cotizacion            DECIMAL(12,2)   NOT NULL,
    observacion_cotizacion      TEXT,
    estado_cotizacion           VARCHAR(20)     NOT NULL,
    ruta_pdf_cotizacion         VARCHAR(255)    NOT NULL,
    CONSTRAINT fk_cotizacion_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente) ON DELETE RESTRICT,
    CONSTRAINT chk_cotizacion_vigencia CHECK (vigencia_cotizacion >= fecha_cotizacion)
);
CREATE INDEX idx_cotizacion_cliente ON cotizacion (id_cliente);

-- =====================================================================
-- 11. DETALLE_COTIZACION 
-- =====================================================================
CREATE TABLE detalle_cotizacion (
    id_dc               SERIAL PRIMARY KEY,
    id_cotizacion       INT             NOT NULL,
    id_producto         INT             NOT NULL,
    descripcion_dc      VARCHAR(200)    NOT NULL,
    cantidad_dc         DECIMAL(10,2)   NOT NULL CHECK (cantidad_dc > 0),
    precio_unitario_dc  DECIMAL(12,2)   NOT NULL CHECK (precio_unitario_dc >= 0),
    subtotal_dc         DECIMAL(12,2)   NOT NULL,
    CONSTRAINT fk_dc_cotizacion FOREIGN KEY (id_cotizacion)
        REFERENCES cotizacion (id_cotizacion) ON DELETE CASCADE,
    CONSTRAINT fk_dc_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto) ON DELETE RESTRICT
);
CREATE INDEX idx_dc_cotizacion ON detalle_cotizacion (id_cotizacion);
CREATE INDEX idx_dc_producto ON detalle_cotizacion (id_producto);

-- =====================================================================
-- 12. ORDEN_COMPRA 
-- =====================================================================
CREATE TABLE orden_compra (
    id_oc               SERIAL PRIMARY KEY,
    id_cliente          INT             NOT NULL,
    id_cotizacion       INT,
    numero_oc           VARCHAR(50)     NOT NULL UNIQUE,
    fecha_oc            DATE            NOT NULL,
    ruta_documento_oc   VARCHAR(255)    NOT NULL,
    CONSTRAINT fk_oc_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente) ON DELETE RESTRICT,
    CONSTRAINT fk_oc_cotizacion FOREIGN KEY (id_cotizacion)
        REFERENCES cotizacion (id_cotizacion) ON DELETE SET NULL
);
CREATE INDEX idx_oc_cliente ON orden_compra (id_cliente);
CREATE INDEX idx_oc_cotizacion ON orden_compra (id_cotizacion);

-- =====================================================================
-- 13. FACTURA 
-- =====================================================================
CREATE TABLE factura (
    id_factura          SERIAL PRIMARY KEY,
    id_oc               INT             NOT NULL UNIQUE,
    id_cliente          INT             NOT NULL,
    numero_factura      VARCHAR(30)     NOT NULL UNIQUE,
    fecha_factura       DATE            NOT NULL,
    subtotal_factura    DECIMAL(12,2)   NOT NULL,
    iva_factura         DECIMAL(12,2)   NOT NULL,
    total_factura       DECIMAL(12,2)   NOT NULL,
    estado_factura      VARCHAR(30)     NOT NULL,
    ruta_pdf_factura    VARCHAR(255)    NOT NULL,
    CONSTRAINT fk_factura_oc FOREIGN KEY (id_oc)
        REFERENCES orden_compra (id_oc) ON DELETE RESTRICT,
    CONSTRAINT fk_factura_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente) ON DELETE RESTRICT
);
CREATE INDEX idx_factura_cliente ON factura (id_cliente);

-- =====================================================================
-- 14. DETALLE_FACTURA
-- =====================================================================
CREATE TABLE detalle_factura (
    id_df               SERIAL PRIMARY KEY,
    id_factura          INT             NOT NULL,
    id_producto         INT             NOT NULL,
    descripcion_df      VARCHAR(200)    NOT NULL,
    cantidad_df         DECIMAL(10,2)   NOT NULL CHECK (cantidad_df > 0),
    precio_unitario_df  DECIMAL(12,2)   NOT NULL CHECK (precio_unitario_df >= 0),
    subtotal_df         DECIMAL(12,2)   NOT NULL,
    CONSTRAINT fk_df_factura FOREIGN KEY (id_factura)
        REFERENCES factura (id_factura) ON DELETE CASCADE,
    CONSTRAINT fk_df_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto) ON DELETE RESTRICT
);
CREATE INDEX idx_df_factura ON detalle_factura (id_factura);
CREATE INDEX idx_df_producto ON detalle_factura (id_producto);

-- =====================================================================
-- 15. MOVIMIENTO
-- =====================================================================
CREATE TABLE movimiento (
    id_movimiento           SERIAL PRIMARY KEY,
    id_inventario           INT             NOT NULL,
    id_usuario              INT             NOT NULL,
    tipo_movimiento         VARCHAR(20)     NOT NULL
        CHECK (tipo_movimiento IN ('Entrada', 'Salida', 'Ajuste')),
    cantidad_movimiento     DECIMAL(15,2)   NOT NULL CHECK (cantidad_movimiento > 0),
    fecha_movimiento        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_movimiento   VARCHAR(50),
    observacion_movimiento  TEXT,
    CONSTRAINT fk_movimiento_inventario FOREIGN KEY (id_inventario)
        REFERENCES inventario (id_inventario) ON DELETE RESTRICT,
    CONSTRAINT fk_movimiento_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario) ON DELETE RESTRICT
);
CREATE INDEX idx_movimiento_inventario ON movimiento (id_inventario);
CREATE INDEX idx_movimiento_usuario ON movimiento (id_usuario);

-- =====================================================================
-- 16. NOTA_CREDITO
-- =====================================================================
CREATE TABLE nota_credito (
    id_nc           SERIAL PRIMARY KEY,
    id_factura      INT             NOT NULL,
    numero_nc       VARCHAR(50)     NOT NULL UNIQUE,
    fecha_nc        DATE            NOT NULL,
    motivo_nc       TEXT            NOT NULL,
    subtotal_nc     DECIMAL(12,2)   NOT NULL,
    iva_nc          DECIMAL(12,2)   NOT NULL,
    total_nc        DECIMAL(12,2)   NOT NULL,
    estado_nc       VARCHAR(20)     NOT NULL,
    CONSTRAINT fk_nc_factura FOREIGN KEY (id_factura)
        REFERENCES factura (id_factura) ON DELETE RESTRICT
);
CREATE INDEX idx_nc_factura ON nota_credito (id_factura);

-- =====================================================================
-- FIN DEL SCRIPT
-- =====================================================================
