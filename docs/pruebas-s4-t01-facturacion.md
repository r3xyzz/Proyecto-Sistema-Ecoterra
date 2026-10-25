# S4-T01 - Backend facturación y detalle de factura

Fecha: 25 de octubre de 2026.

**Resultado: pruebas ejecutadas; aprobación completa pendiente por incidencias reproducidas.**

Se evaluó el alcance de la tarjeta: modelo Factura, detalle, OC, cliente, productos, cantidades, valores, cálculos, endpoints e integración con frontend. No se modificó la tarjeta externa ni la implementación funcional del módulo durante esta revisión. Se agregaron pruebas y un `__init__.py` para que Django descubra el paquete de pruebas de facturación.

## Entornos y evidencia

- Backend aislado: SQLite de pruebas, autenticación Bearer real, modelos/serializadores/vistas reales. Las tablas unmanaged se preparan únicamente en la base de pruebas.
- Instancia real: frontend `http://localhost:5173/`, API local y base existente, con el administrador facilitado por el usuario. No se guardaron credenciales ni tokens en los informes.
- Pruebas nuevas del módulo: **28 ejecutadas, 24 aprobadas, 4 fallidas**.
- Batería conjunta: **52 ejecutadas, 48 aprobadas, 4 fallidas**. Incluye las pruebas anteriores de clientes y PDF.
- TypeScript y compilación Vite: aprobados.

Archivos de evidencia:

- [Pruebas automatizadas](../backend/facturacion/tests.py).
- [Salida de la batería conjunta](evidencias-s4-t01/resultados-backend.txt).
- [Resultados de API real](evidencias-s4-t01/resultados-api-real.txt).
- [Validación de productos repetidos](evidencias-s4-t01/validacion-productos-repetidos.png).
- [Factura creada desde la web](evidencias-s4-t01/factura-creada-web.png).
- [Lista desactualizada al regresar al módulo](evidencias-s4-t01/factura-ausente-al-volver.png).
- [Factura persistida tras renovar sesión](evidencias-s4-t01/factura-persistida.png).

## Matriz de la tarjeta

| Elemento | Resultado | Comprobación |
| --- | --- | --- |
| Modelo Factura | Aprobado en creación | Número generado, fecha, estado inicial y totales persistidos. La regla 1:1 tiene una diferencia entre entornos descrita abajo. |
| Detalle Factura | Parcial | Dos líneas persistidas con producto, cantidad, precio y subtotal correctos; `producto_nombre` llega vacío. |
| Asociación con OC | Aprobada en instancia real | La factura apunta a la OC QA correcta. Una segunda factura para la misma OC devuelve 409. |
| Asociación con cliente | Parcial | Se guarda el cliente de la OC y se rechaza otro cliente con 400. El formulario muestra «Cliente 1» en lugar de su razón social. |
| Registro de productos | Aprobado | Dos productos diferentes; duplicados rechazados en frontend y backend. |
| Cantidades | Aprobado | Enteros y fracciones; cero, negativos, texto, no finitos, exceso de decimales y fuera de rango rechazados en pruebas aisladas. |
| Valores | Parcial | Positivos y decimales correctos; negativos y formatos inválidos rechazados. La API acepta precio cero en la base aislada, aunque modelo y frontend exigen mayor que cero. |
| Cálculos | Aprobado | Subtotal por línea, suma, IVA 19%, total, redondeo decimal y recálculo comprobados. |
| Endpoints | Parcial | Crear, listar, consultar y cambiar estado funcionan; PATCH de detalles devuelve 500. |
| Integración frontend | Parcial | Registro real, validaciones y vista previa funcionan. La factura recién creada desaparece de la lista al salir del módulo y regresar, hasta renovar sesión. |
| Pruebas | Ejecutadas | Hay evidencia reproducible; las incidencias impiden declarar aprobación completa. |

## Registro real utilizado

Se creó una OC de prueba **QA-S4T01-e05e8a49**, ID **7**, para el cliente existente **Prueba Cliente**, ID **1**. Su campo de referencia de documento se marcó como `qa/s4t01/sin-documento-adjunto`; no se subió ningún adjunto. Un primer intento con ese campo vacío fue rechazado con 400 y no creó una OC.

Desde el formulario real de la web se creó la factura **F-00005**, ID **5**, con estas líneas:

| Producto | Cantidad | Precio unitario | Subtotal |
| --- | ---: | ---: | ---: |
| POL-005 - EcoAgroPol Aplicación Agrícola 25L | 2,00 | $1.000,00 | $2.000,00 |
| POL-002 - EcoDust Control Supresor de Polvo 25L | 1,50 | $200,00 | $300,00 |

Subtotal **$2.300,00**, IVA **$437,00**, total **$2.737,00**. La API confirmó ambos detalles y los importes almacenados. La razón social correcta aparece después de guardar.

Se probaron sobre esta factura los estados EMITIDA, PAGADA, ANULADA y PENDIENTE: todos devolvieron 200 y se dejó finalmente en **PENDIENTE**. Un estado inexistente devolvió 400. Estas operaciones invalidaron únicamente la asociación PDF de esta factura de prueba, según el comportamiento implementado.

No se eliminaron datos reales ni se modificaron facturas preexistentes. Se conservan la OC y la factura QA para trazabilidad. La eliminación en cascada se probó exclusivamente en SQLite de pruebas.

## Incidencias

### INC-01 - PATCH de detalles devuelve error 500

Reproducido en SQLite y en la API real: `PATCH /api/facturas/5/` con cliente, OC y una lista válida de detalles devuelve 500. El endpoint se expone mediante ModelViewSet, pero el serializador solo implementa la creación de detalles anidados; no implementa su actualización.

Impacto: un cliente API no obtiene una respuesta controlada al intentar actualizar los detalles. Si editar no pertenece al alcance funcional, se deben restringir explícitamente los métodos en lugar de exponer una operación que falla.

### INC-02 - `producto_nombre` vacío

Reproducido en SQLite y en la API real. En la respuesta de F-00005 ambos detalles tienen `producto_nombre: ""`, aunque las relaciones con productos y `descripcion_df` sí están guardadas.

Origen identificado: `DetalleFacturaSerializer` utiliza `id_producto.nombre_producto`, pero el atributo del modelo Producto se llama `nombre`.

### INC-03 - Precio cero aceptado por la API

Reproducido únicamente en SQLite mediante la prueba de aceptación: precio unitario `0` devuelve 201 y crea una factura. El frontend y el validador del modelo requieren mínimo 0,01, mientras el serializador de entrada permite 0,00.

No se envió este caso contra la instancia real para evitar crear deliberadamente una factura de importe cero. Debe unificarse la regla entre capas o documentarse una política explícita de gratuidad.

### INC-04 - Regla 1:1 depende del esquema externo

En la instancia real, repetir una factura para la OC QA devuelve **409**, por lo que la protección funciona en la base actual. En la base SQLite construida desde el modelo de facturación, la misma prueba devuelve **201** y admite dos facturas.

El modelo `facturacion.Factura.id_orden_compra` es una ForeignKey sin unicidad, y su serializador no verifica una factura previa. El modelo paralelo de ventas sí declara OneToOneField. No se debe interpretar este fallo local como una duplicación confirmada en Supabase: es una diferencia entre el modelo y la restricción externa que debe resolverse para una prueba reproducible del contrato 1:1.

### INC-05 - Lista desactualizada al volver al módulo

Reproducido visualmente: después de crear F-00005, aparece en la tabla y el total facturado sube a $386.289,47. Al navegar a Cotizaciones y volver a Facturación, solo aparecen las dos facturas anteriores y el total baja a $383.552,47. La API sigue devolviendo F-00005.

Origen identificado: Facturacion mantiene la creación en su estado local; el estado de facturas de App no se actualiza y solo carga desde la API cuando cambia la sesión. Al remontar el módulo se restauran las props anteriores.
Después de cerrar e iniciar sesión se confirmó visualmente que F-00005 reaparece con sus importes correctos y estado PENDIENTE.

### INC-06 - Nombre del cliente en formulario

Reproducido visualmente: al seleccionar la OC QA, el formulario muestra «Cliente 1» en vez de «Prueba Cliente». La asociación almacenada sí es correcta. `obtenerNombreCliente` solo busca el nombre en un objeto `id_cliente`, mientras la API entrega el nombre en `cliente_nombre` y el ID como número.

## Cobertura adicional aprobada

Se verificaron campos obligatorios, detalles vacíos, relaciones inexistentes, cliente distinto al de la OC, productos repetidos, intentos de alterar totales/número/estado/ruta PDF desde la creación, número distinto para OC diferentes, rollback de factura y detalles ante fallo durante la creación, recálculo sin persistir y rechazo de recálculo sin guardar. La autenticación anónima y el token inválido se rechazan; la denegación por permisos se prueba con la decisión de permisos simulada, sin auditar todas las combinaciones reales de roles.

## Repetición

Con las dependencias de `backend/requirements-test.txt` instaladas y una `DJANGO_SECRET_KEY` de pruebas configurada:

```powershell
python backend/manage.py test facturacion --verbosity 2
python backend/manage.py test clientes cotizaciones facturacion proveedores ventas --verbosity 1
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vite/bin/vite.js build
```

**Criterio de cierre:** resolver o excluir formalmente del alcance las incidencias, repetir los casos afectados y obtener una batería sin fallos antes de marcar la tarjeta como aprobada completamente.
