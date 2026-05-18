<!-- BEGIN:nextjs-agent-rules -->
# BioActiva CRM — Guía para Agentes IA

> Este archivo define las reglas, estructura, convenciones y contexto completo del proyecto para que cualquier agente IA trabaje de forma coherente, sin duplicar código y respetando los estándares del equipo.

---

## 1. Contexto del Proyecto

**BioActiva** es una empresa peruana especializada en gestión de innovación, I+D+i, formulación de proyectos, vigilancia tecnológica y propiedad intelectual. Este CRM centraliza su operación comercial reemplazando hojas de Excel manuales.

### Problema que resuelve
- Duplicidad de datos en Excel
- Pérdida de seguimiento de oportunidades comerciales
- Falta de visibilidad del proceso comercial
- Dificultad para validar organizaciones

### Objetivo
Plataforma web CRM que gestione el ciclo comercial completo: desde la identificación de un prospecto hasta el cierre, con notificaciones, dashboards e importación/exportación de datos.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Estado global | Zustand |
| Server state / caché | React Query (TanStack Query v5) |
| Validación | Zod + React Hook Form |
| Iconos | Lucide React |
| Gráficas | Recharts |
| Drag & Drop (Kanban) | @dnd-kit/core + @dnd-kit/sortable |
| HTTP Client | Axios |
| Runtime | Node.js v24 |

---

## 3. Roles del Sistema

| Rol | Descripción |
|---|---|
| **Administrador** | Acceso total. Único que puede gestionar usuarios (invitar, deshabilitar, asignar roles). Accede a todos los módulos. |
| **Trabajador** | Usuario operativo. Gestiona organizaciones, contactos, leads, cotizaciones, notificaciones, dashboard, importación y exportación. NO accede a control de acceso. |

---

## 4. Módulos y Estado

| Módulo | Ruta | CU | Rol | Estado |
|---|---|---|---|---|
| 🔐 Login / Auth | `/login`, `/forgot-password`, `/reset-password`, `/activate` | CU001 | Público | ⏳ PENDIENTE |
| 👥 Control de Acceso | `/control-acceso` | CU002 | Solo Administrador | ⏳ PENDIENTE |
| 🏢 Organizaciones | `/organizaciones`, `/organizaciones/[id]` | CU003 | Ambos | ⏳ PENDIENTE |
| 👤 Contactos | `/contactos`, `/contactos/[id]` | CU004 | Ambos | ⏳ PENDIENTE |
| 📊 Pipeline / Leads | `/pipeline`, `/pipeline/[id]` | CU005 | Ambos | ⏳ PENDIENTE |
| 💰 Cotizaciones | `/cotizaciones`, `/cotizaciones/[id]` | CU006 | Ambos | ⏳ PENDIENTE |
| 🔔 Notificaciones | `/notificaciones` | CU007 | Ambos | ⏳ PENDIENTE |
| 📈 Dashboard | `/dashboard` | CU008 | Ambos | ⏳ PENDIENTE |
| 📥 Importar / Exportar | `/datos` | CU009, CU010 | Ambos | ⏳ PENDIENTE |
| 📧 Plantillas de Correo | `/plantillas` | CU011 | Ambos | ⏳ PENDIENTE |

**Estados posibles**: ⏳ PENDIENTE | 🚧 EN PROGRESO | ✅ LISTO

---

## 5. Descripción Detallada de Módulos

### CU001 — Autenticación
- Login con correo y contraseña
- Generación de JWT token al autenticar
- Recuperación de contraseña por correo (token con expiración)
- Activación de cuenta por enlace (token de activación)
- Validaciones: correo válido, usuario habilitado, contraseña hash
- Mensajes de error específicos por caso

### CU002 — Gestión de Usuarios (solo Administrador)
- Invitar usuario por correo institucional con rol asignado
- Envío de correo con token de activación
- El usuario invitado define nombre, apellido y contraseña al activar
- Deshabilitar usuarios activos
- Listado y detalle de usuarios registrados

### CU003 — Gestión de Organizaciones
- Registrar, consultar y editar organizaciones
- Identificación única por RUC (11 dígitos) o código interno único
- Consulta automatizada a SUNAT por RUC o razón social (web scraping)
- Autocompletado de campos desde SUNAT
- Detalle muestra: info general, contactos asociados, historial de leads, historial de cotizaciones
- Si tiene más de 6 contactos → botón "Ver todos" redirige a /contactos con filtro aplicado
- Campos: nombre, nombre_comercial, sub_area, ruc, tipo, linkedin, ubicacion, sector, tamaño, actividad_economica, alianzas_estrategicas
- No se elimina físicamente (RN-003)

### CU004 — Gestión de Contactos
- Registrar, consultar y editar contactos
- Vinculación obligatoria a una organización existente
- Correo principal único en todo el sistema
- Campos: organización, vocativo, nombres, apellidos, cargo, correo, correo2, teléfono, comentarios
- No se elimina físicamente (RN-003)

### CU005 — Pipeline de Leads
- Vista Kanban con columnas: En prospecto | Ofertado | Cierre con venta | Cierre sin venta
- Drag & drop para cambiar estado entre columnas
- Registro obligatorio de organización, opcional de contacto
- Actividades de seguimiento por lead: Email, Reunión, Llamada, Otro
- Estados de actividad: Pendiente, Completada
- No se puede crear nueva actividad si la anterior está Pendiente (RN-008)
- Historial de comentarios por actividad
- Filtros por organización, estado, encargado, servicio
- No se elimina físicamente (RN-003)

### CU006 — Gestión de Cotizaciones
- Vinculada obligatoriamente a un lead
- Autocompletado de cliente, contacto y servicio desde el lead seleccionado
- Estados: Pendiente, Enviada, Aceptada, Rechazada
- Cotización Aceptada → lead pasa a "Cierre con venta" automáticamente
- Cotización Rechazada → lead pasa a "Cierre sin venta" automáticamente
- Antes de cerrar: verificar que el lead no tenga actividades Pendientes
- Monto >= 0 (RF-0062)
- Campos: fecha, dirigido, cliente, producto, remitente, nombre_servicio, monto, moneda, estado, observacion, link_propuesta
- No se elimina físicamente (RN-003)

### CU007 — Gestión de Notificaciones
- Dos tipos: Recordatorio (solo interno al responsable) y Seguimiento (interno + externo al cliente)
- Recordatorio: correo al responsable en fecha/hora definida
- Seguimiento: correo interno al responsable → si no marca completado → correo externo al cliente
- Usa plantillas de correo (CU011) con personalización sin modificar plantilla original
- Secciones: Programadas y Vencidas
- Canceladas: se eliminan, no se ejecutan, no aparecen en historial
- Alerta automática si lead supera 30 días sin cambio de estado
- Una sola notificación por actividad (RF-0061)

### CU008 — Dashboard
- Métricas: leads generados, % propuesta→cierre con venta, tiempo promedio cierre, tiempo en etapa propuesta, promedio acciones por lead, monto total pipeline, ingresos cerrados, % leads sin avance >30 días
- Filtros: fecha inicio, fecha fin, tipo de servicio
- Solo consulta, no modifica datos
- Gráficas con Recharts

### CU009 — Importación de Datos
- Importar desde Excel (.xlsx, .xls, .csv)
- Flujo en 3 etapas: Subir archivo → Preview y conflictos → Confirmar
- Valida estructura, campos obligatorios, duplicados, relaciones
- Muestra preview antes de confirmar
- Registra historial de importación

### CU010 — Exportación de Datos
- Exportar organizaciones, contactos, leads o cotizaciones en CSV
- Filtros por tipo de entidad:
  - Organizaciones: sector, tamaño, tipo, departamento
  - Contactos: organización asociada
  - Leads: estado
  - Cotizaciones: estado
- No modifica datos

### CU011 — Plantillas de Correo
- Crear, editar, desactivar y eliminar plantillas
- Campos: nombre (único), asunto, cuerpo, estado (activa/inactiva)
- No se puede eliminar si está en uso en notificaciones activas → solo desactivar
- Las plantillas activas aparecen en el selector de notificaciones

---

## 6. ENUMs del Sistema

**Todos los ENUMs viven en `src/types/enums.ts`. No redefinirlos en otro lugar.**

```ts
export enum RolUsuario      { Administrador = 'Administrador', Trabajador = 'Trabajador' }
export enum EstadoUsuario   { Pendiente = 'Pendiente', Activo = 'Activo', Inactivo = 'Inactivo' }
export enum LeadState       { Prospecto = 'En prospecto', Ofertado = 'Ofertado', CierreVenta = 'Cierre con venta', CierreSinVenta = 'Cierre sin venta' }
export enum TipoActividad   { Email = 'Email', Reunion = 'Reunion', Llamada = 'Llamada', Otro = 'Otro' }
export enum EstadoActividad { Pendiente = 'Pendiente', Completada = 'Completada' }
export enum EstadoCot       { Pendiente = 'Pendiente', Enviada = 'Enviada', Aceptada = 'Aceptada', Rechazada = 'Rechazada' }
export enum TipoMoneda      { Soles = 'PEN', Dolares = 'USD' }
export enum TipoEmpresa     { Privada = 'Privada', Publica = 'Publica', ONG = 'ONG', Mixta = 'Mixta' }
export enum TamanoEmpresa   { Micro = 'Micro', Pequena = 'Pequena', Mediana = 'Mediana', Grande = 'Grande' }
export enum EstadoNotif     { NoLeida = 'No Leida', Leida = 'Leida' }
export enum TokenPurpose    { Activacion = 'Activacion', Recuperacion = 'Recuperacion' }
export enum EstadoSecuencia { Programada = 'Programada', EnEjecucion = 'EnEjecucion', Completada = 'Completada', Cancelada = 'Cancelada' }
export enum Vocativo        { Sr = 'Sr', Sra = 'Sra', Dr = 'Dr', Dra = 'Dra', Ing = 'Ing', Lic = 'Lic' }
export enum Sector          { Agroindustria = 'Agroindustria', Manufactura = 'Manufactura', Tecnologia = 'Tecnologia', Salud = 'Salud', Educacion = 'Educacion', OtroSector = 'Otro' }
```

---

## 7. Diccionario de Datos (Entidades Principales)

### Usuarios
`id, nombres, apellidos, rol(ENUM), estado(ENUM), correo(único), password(hash), created_at, updated_at`

### Organizaciones
`id(UUID), codigo_cliente(único), nombre(único), nombre_comercial, sub_area, ruc(11 chars), tipo(ENUM), linkedin, ubicacion, sector(ENUM), tamaño(ENUM), actividad_economica, alianzas_estrategicas, id_contacto_activo(FK), id_author(FK), created_at, updated_at`

### Contactos
`id, nombres, apellidos, vocativo(ENUM), cargo, correo(único), telefono, correo2, comentarios, id_organizacion(FK), id_author(FK), created_at, updated_at`

### Leads
`id, id_org(FK UUID), id_contacto(FK opcional), estado(ENUM), servicio_interes, comentarios, desafio_oportunidad, notas_contacto, id_encargado(FK), canal_captacion, id_author(FK), created_at, updated_at`

### Actividades
`id, id_lead(FK), id_responsable(FK), nombre_actividad, fecha_inicio, tipo(ENUM), estado(ENUM), fecha_fin, notas, outlook_event_id, outlook_imported, teamsMeetingUrl, seguimiento_automatico, id_author(FK), created_at, updated_at`

### Cotizaciones
`id, id_lead(FK), id_remitente(FK), fecha_cot, dirigido, cliente, producto, nombre_remitente, nombre_servicio, monto(DECIMAL≥0), tipo(ENUM moneda), estado(ENUM), observacion, link_propuesta, id_author(FK), created_at, updated_at`

### Notificaciones
`id, id_usuario(FK), id_actividad(FK), titulo, mensaje, estado(ENUM), created_at`

### Templates Email
`id, nombre(único), asunto, cuerpo, activo(bool), created_at, updated_at`

### User Tokens
`id, correo, token_hash(único), proposito(ENUM), id_usuario(FK), rol(ENUM), invitador_id(FK), estado(ENUM), expires_at, consumed_at, created_at`

---

## 8. Reglas de Negocio Críticas

| Código | Regla | Impacto en Frontend |
|---|---|---|
| RN-001 | Sesión válida para todo acceso | Guard en layout (dashboard) |
| RN-002 | Control por rol | Ocultar /control-acceso para Trabajador |
| RN-003 | Sin borrado físico de org/contacto/lead/cotización | No mostrar botón eliminar, solo desactivar |
| RN-004 | Sin RUC → código interno obligatorio | Validación condicional en OrganizacionForm |
| RN-005 | Contacto vinculado a organización obligatoriamente | Validación en ContactoForm |
| RN-006 | Lead vinculado a organización obligatoriamente | Validación en LeadForm |
| RN-007 | Cotización Aceptada → lead Cierre con venta | Lógica en cotizaciones.service.ts |
| RN-007 | Cotización Rechazada → lead Cierre sin venta | Lógica en cotizaciones.service.ts |
| RN-008 | No nueva actividad si anterior está Pendiente | Bloquear ActividadForm |
| RN-009 | Solo estados válidos del pipeline | Usar LeadState enum |
| RN-013 | Una sola notificación por actividad | Verificar en RecordatorioForm/SeguimientoForm |
| RF-0062 | Monto cotización >= 0 | Schema Zod cotizacion.schema.ts |

---

## 9. Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/             # login, forgot-password, reset-password, activate
│   └── (dashboard)/        # todas las rutas protegidas
│
├── components/
│   ├── ui/                 # átomos: Button, Input, Select, Badge, Modal, Table, Card, Spinner, Toast, EmptyState
│   ├── layout/             # Sidebar, Navbar, PageHeader
│   └── modules/            # componentes por módulo
│
├── hooks/                  # custom hooks por dominio
├── services/
│   ├── api/client.ts       # Axios con interceptores
│   ├── api/endpoints.ts    # TODAS las URLs aquí
│   ├── mock/               # data falsa por módulo
│   └── modules/            # servicios: switch mock ↔ API
│
├── store/                  # Zustand: auth.store, ui.store
├── types/                  # interfaces + enums.ts
└── lib/
    ├── utils/              # date, format, validation, csv
    ├── constants/          # routes.ts, queryKeys.ts, config.ts
    └── validators/         # schemas Zod
```

---

## 10. Patrón Mock → API

El switch entre mock y API real se controla **únicamente** en `src/services/modules/*.service.ts`.

```ts
// src/lib/constants/config.ts
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// src/services/modules/leads.service.ts
import { USE_MOCK } from '@/lib/constants/config'
import { ENDPOINTS } from '@/services/api/endpoints'
import { apiClient } from '@/services/api/client'
import * as mock from '@/services/mock/leads.mock'

export const leadsService = {
  getAll: async (filters?) => {
    if (USE_MOCK) return mock.getLeads(filters)
    return apiClient.get(ENDPOINTS.leads.list, { params: filters })
  },
}
```

**Integrar backend real = cambiar `NEXT_PUBLIC_USE_MOCK=false` en `.env.local`. Nada más.**

---

## 11. Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=BioActiva CRM
```

---

## 12. Convención de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
refactor: mejora de código sin cambio funcional
style: cambios de estilos/UI
chore: tareas de mantenimiento, dependencias
docs: documentación
```

Ejemplos:
```
feat(auth): implement login form with JWT
feat(organizaciones): add SUNAT search integration
fix(pipeline): fix drag and drop state update
refactor(cotizaciones): extract form validation to schema
```

---

## 13. Skills Instaladas

El proyecto tiene las siguientes skills activas (instaladas via autoskills):

- `accessibility` — buenas prácticas de accesibilidad web
- `seo` — optimización para motores de búsqueda
- `frontend-design` — diseño de interfaces production-grade
- `tailwind-css-patterns` — patrones avanzados de Tailwind
- `react-hook-form` — formularios con validación
- `zod` — validación de esquemas TypeScript
- `nodejs-best-practices` — buenas prácticas Node.js
- `react-best-practices` — patrones React modernos
- `composition-patterns` — patrones de composición de componentes
- `next-best-practices` — convenciones Next.js 16
- `next-cache-components` — estrategias de caché en Next.js
- `next-upgrade` — guía de migración y upgrades
- `typescript-advanced-types` — tipos avanzados TypeScript
- `nodejs-backend-patterns` — patrones de backend Node.js

---

## 14. Reglas Críticas (NO negociables)

- ❌ Nunca hacer `fetch` o `axios` directamente en componentes o páginas
- ❌ Nunca hardcodear URLs fuera de `endpoints.ts`
- ❌ Nunca hardcodear rutas fuera de `routes.ts`
- ❌ Nunca redefinir ENUMs fuera de `enums.ts`
- ❌ Nunca usar `any` sin justificación documentada
- ❌ Nunca crear tipos inline en componentes si ya existen en `src/types/`
- ❌ Nunca importar con rutas relativas largas (`../../../../`); usar alias `@/`
- ❌ Nunca poner lógica de negocio en componentes de `src/components/ui/`
- ❌ Nunca eliminar físicamente organizaciones, contactos, leads o cotizaciones (RN-003)
- ❌ Nunca crear archivos de prueba, scratch, temp o demo en el proyecto

---

## 15. Skills del Equipo

### skill:mock-to-api
Cuando el backend entregue un endpoint:
1. Agregar URL en `src/services/api/endpoints.ts`
2. Actualizar `src/services/modules/[modulo].service.ts`
3. Probar con `NEXT_PUBLIC_USE_MOCK=false`
4. No tocar componentes, hooks ni páginas

### skill:nuevo-modulo
1. Crear `src/app/(dashboard)/[modulo]/page.tsx`
2. Crear tipos en `src/types/[modulo].types.ts`
3. Crear schema Zod en `src/lib/validators/[modulo].schema.ts`
4. Crear mock en `src/services/mock/[modulo].mock.ts`
5. Crear servicio en `src/services/modules/[modulo].service.ts`
6. Crear hook en `src/hooks/[modulo]/use[Modulo].ts`
7. Crear componentes en `src/components/modules/[modulo]/`
8. Agregar endpoints en `src/services/api/endpoints.ts`
9. Agregar ruta en `src/lib/constants/routes.ts`
10. Agregar query keys en `src/lib/constants/queryKeys.ts`
11. Agregar ítem al Sidebar si corresponde

### skill:nuevo-componente-ui
1. Crear carpeta `src/components/ui/[Nombre]/`
2. Archivos: `[Nombre].tsx`, `[Nombre].types.ts`, `index.ts`
3. Exportar desde `src/components/ui/index.ts`
4. Sin lógica de negocio ni llamadas a servicios

### skill:validacion-formulario
1. Definir schema Zod en `src/lib/validators/`
2. Usar `react-hook-form` con `zodResolver`
3. Errores inline, no como toast
4. Toast solo para éxito o error de red
<!-- END:nextjs-agent-rules -->
