# Documentos PDF

Los botones PDF de cotizaciones y facturas consultan el archivo almacenado. Si aún no existe, lo generan en el backend y lo asocian al registro antes de abrirlo. Desde el visor PDF del navegador se puede descargar o imprimir.

## Configuración

Instalar `backend/requirements.txt` en el entorno de Python del servidor. Configurar exclusivamente en el backend:

```dotenv
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-clave-secreta
SUPABASE_STORAGE_BUCKET=facturas-pdf
```

Crear ese bucket como **privado** en Supabase Storage. Se reutiliza para las carpetas `facturas/` y `cotizaciones/`. No exponer claves secretas en variables `VITE_*`. La aplicación no crea ni cambia la visibilidad del bucket automáticamente.

## API y protección

- `POST /api/cotizaciones/{id}/generar-pdf/`
- `GET /api/cotizaciones/{id}/pdf/`
- `POST /api/facturas/{id}/generar-pdf/`
- `GET /api/facturas/{id}/pdf/`

Requieren autenticación y permisos del módulo correspondiente: Crear para generar y Consultar para abrir. Los enlaces firmados duran 300 segundos; quien reciba uno podrá usarlo durante ese plazo. Las rutas se asignan desde el servidor. Cada generación usa una ruta nueva para conservar el archivo anterior. Las versiones anteriores requieren una política de retención si se desea eliminarlas.

Al editar una cotización se invalida su asociación al PDF anterior; la siguiente consulta genera una versión actualizada. Para regenerar explícitamente un documento se utiliza el endpoint POST.
Al cambiar el estado de una factura mediante `/acciones/`, también se invalida su PDF para que la siguiente apertura muestre el estado vigente.

## Pruebas automatizadas

Instalar `backend/requirements-test.txt` en el entorno Python de pruebas y ejecutar desde la raíz:

```powershell
python backend/manage.py test clientes cotizaciones proveedores ventas --verbosity 1
node --test scripts/test-document-pdf.mjs
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vite/bin/vite.js build
```

Las pruebas requieren `DJANGO_SECRET_KEY` configurada para el entorno de pruebas. Django utiliza una base SQLite de pruebas; no modifica la base de Supabase. Las tablas de ventas unmanaged se crean y eliminan únicamente en esa base de pruebas. Storage se simula; el renderizador y los PDF utilizados por las pruebas son reales.

## Validación pendiente con Ecoterra

Revisar identidad del emisor, logo, datos de contacto, condiciones comerciales y formato de factura con la empresa. La generación de este PDF por sí sola no incorpora una integración tributaria electrónica.

Prueba manual con un usuario autorizado: guardar cotización con productos, abrir PDF, verificar cliente, fechas, cantidades y totales, descargarlo y volver a consultarlo. Repetir con una factura. Comprobar también acceso denegado sin sesión y errores de Storage. Los tests unitarios de `cotizaciones.tests.DocumentPdfTests` usan Storage simulado y no suben archivos reales.
