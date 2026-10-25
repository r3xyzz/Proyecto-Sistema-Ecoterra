# Resultado de pruebas PDF - 25 de octubre de 2026

## Verificado

- Backend: 24 pruebas aprobadas, incluyendo creación por API, autenticación Bearer, asociación persistida en SQLite, generación de bytes PDF reales, consulta de enlaces de 300 segundos, permisos denegados y fallo de Storage sin reemplazar la asociación anterior.
- Frontend: 8 pruebas aprobadas del código real de consulta/generación: documento existente, primera generación, token, falta de sesión, permisos insuficientes, fallo de Storage, respuesta inválida, protocolo no permitido y fallo de red. Algunos casos se agrupan en una misma prueba.
- Navegador Edge headless con API simulada: el botón de cotización genera y abre el documento; una segunda apertura reutiliza el archivo; el botón de factura genera y abre; ante fallo de Storage aparece el mensaje de error y se cierra la ventana temporal. Sin errores de ejecución de React. Todas las solicitudes protegidas envían el token.
- TypeScript: `tsc --noEmit` aprobado.
- Producción: compilación Vite aprobada.
- Inspección visual: factura de una página y cotización de seis páginas con 90 productos y descripciones extensas. Se revisaron primera y última página de la cotización, encabezados, acentos, importes, totales y numeración. No se observaron recortes ni superposiciones en esas páginas.

## Problemas corregidos

- Al cambiar el estado de una factura, el PDF almacenado seguía mostrando el estado anterior. Ahora se invalida la asociación y se regenera al abrirlo. Una prueba verifica el estado PAGADA dentro del nuevo PDF.
- Ocho pruebas de clientes estaban desactualizadas: enviaban solicitudes anónimas a endpoints protegidos. Ahora utilizan un usuario administrador y un token de prueba. Se preparan las tablas unmanaged requeridas para comprobar también la eliminación de un cliente sin relaciones.

## Límite de la verificación

No se encontraron archivos de configuración ni variables de entorno con URL y clave secreta de Supabase en esta sesión. Por ello no se pudo comprobar una subida o descarga real, la visibilidad privada del bucket, la conectividad con PostgreSQL ni la caducidad efectiva de un enlace servido por Supabase. La prueba de navegador usa respuestas de API y un destino de documento simulados; la generación y lectura de PDF reales se comprueban por separado en el backend.

El formato comercial todavía requiere validación de Ecoterra. Estos resultados verifican el alcance descrito, no todos los módulos del sistema ni un despliegue con servicios externos.

## Verificación posterior con servicios reales

Tras levantar frontend y backend, se inició sesión correctamente desde `http://localhost:5173/` con el usuario administrador facilitado por el usuario. La contraseña y el token no se guardaron en este informe.

- Login real: HTTP 200, rol Superusuario / Admin.
- Consulta real: 7 cotizaciones y 2 facturas.
- Cotización COT-0007: apertura desde el botón de la web con enlace firmado de Supabase; consulta y descarga HTTP 200, `application/pdf`, 2300 bytes y asociación persistida en el registro.
- Factura F-00003: inicialmente sin PDF (404); generación real HTTP 200, consulta posterior 200 y descarga 200, `application/pdf`, 2565 bytes y asociación persistida.
- Lectura de los PDF descargados: número y total presentes; COT-0007 por $1.585,00 y F-00003 por $371.652,47. Se inspeccionó visualmente la factura descargada sin recortes ni superposiciones.

Esta comprobación real sustituye la limitación anterior respecto de conectividad, generación, almacenamiento y descarga en Supabase para estos dos registros. No se comprobó la caducidad esperando cinco minutos ni se auditó la configuración privada del bucket. No se crearon cotizaciones ni facturas nuevas, ni se alteraron sus importes o estados; únicamente se generaron/asociaron los PDF faltantes.
