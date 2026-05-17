<!-- BEGIN:nextjs-agent-rules -->
# BioActiva CRM — Guía para Agentes IA

> Este archivo define las reglas, estructura, convenciones y contexto del proyecto para que cualquier agente IA (Claude, Cursor, Copilot, etc.) trabaje de forma coherente, sin duplicar código y respetando los estándares del equipo.

---

## 1. Contexto del Proyecto

**BioActiva** es una empresa peruana especializada en gestión de innovación, I+D+i y propiedad intelectual. Este CRM centraliza su operación comercial: organizaciones, contactos, leads, cotizaciones, notificaciones, dashboards e importación/exportación de datos.

- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Zustand + React Query + Zod
- **Backend**: NestJS + PostgreSQL + Prisma ORM (equipo paralelo)
- **Estado actual**: El backend aún no está listo. Usar **data mockeada** mientras tanto.
- **Roles**: `Administrador` y `Trabajador` (distintos permisos, misma app)

---

## 2. Reglas Críticas (NO negociables)

### 2.1 Mock → API: Patrón de integración
El switch entre mock y API real se controla **únicamente** en `src/services/modules/*.service.ts`.
Nunca escribas URLs hardcodeadas en componentes, hooks o páginas.

```ts
// src/services/modules/organizaciones.service.ts
import { USE_MOCK } from '@/lib/constants/config'
import { ENDPOINTS } from '@/services/api/endpoints'
import { apiClient } from '@/services/api/client'
import * as mock from '@/services/mock/organizaciones.mock'

export const organizacionesService = {
  getAll: async (filters?) => {
    if (USE_MOCK) return mock.getOrganizaciones(filters)
    return apiClient.get(ENDPOINTS.organizaciones.list, { params: filters })
  },
  // ...
}
```

Cuando el backend esté listo: cambiar `USE_MOCK=false` en `.env.local`. **Nada más.**

### 2.2 Todas las URLs en un solo lugar
```ts
// src/services/api/endpoints.ts  ← ÚNICO lugar donde viven las URLs
export const ENDPOINTS = {
  auth: {
    login:          '/api/auth/login',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword:  '/api/auth/reset-password',
    activate:       '/api/auth/activate',
  },
  usuarios: {
    list:    '/api/usuarios',
    invite:  '/api/usuarios/invite',
    disable: (id: number) => `/api/usuarios/${id}/disable`,
  },
  organizaciones: {
    list:   '/api/organizaciones',
    detail: (id: string) => `/api/organizaciones/${id}`,
    create: '/api/organizaciones',
    update: (id: string) => `/api/organizaciones/${id}`,
    sunat:  '/api/organizaciones/sunat',
  },
  contactos: {
    list:   '/api/contactos',
    detail: (id: number) => `/api/contactos/${id}`,
    create: '/api/contactos',
    update: (id: number) => `/api/contactos/${id}`,
  },
  leads: {
    list:      '/api/leads',
    detail:    (id: number) => `/api/leads/${id}`,
    create:    '/api/leads',
    update:    (id: number) => `/api/leads/${id}`,
    pipeline:  '/api/leads/pipeline',
  },
  actividades: {
    byLead:   (leadId: number) => `/api/leads/${leadId}/actividades`,
    create:   (leadId: number) => `/api/leads/${leadId}/actividades`,
    complete: (id: number) => `/api/actividades/${id}/complete`,
    delete:   (id: number) => `/api/actividades/${id}`,
  },
  cotizaciones: {
    list:   '/api/cotizaciones',
    detail: (id: number) => `/api/cotizaciones/${id}`,
    create: '/api/cotizaciones',
    update: (id: number) => `/api/cotizaciones/${id}`,
  },
  notificaciones: {
    list:      '/api/notificaciones',
    cancel:    (id: number) => `/api/notificaciones/${id}/cancel`,
    reminder:  '/api/notificaciones/recordatorio',
    seguimiento: '/api/notificaciones/seguimiento',
  },
  plantillas: {
    list:   '/api/plantillas',
    detail: (id: number) => `/api/plantillas/${id}`,
    create: '/api/plantillas',
    update: (id: number) => `/api/plantillas/${id}`,
    delete: (id: number) => `/api/plantillas/${id}`,
  },
  dashboard: {
    metricas: '/api/dashboard/metricas',
  },
  datos: {
    importar: '/api/datos/importar',
    exportar: '/api/datos/exportar',
  },
}
```

### 2.3 Sin código duplicado
- Si un componente se repite 2+ veces → extraerlo a `src/components/ui/` o `src/components/modules/`
- Si una lógica se repite en 2+ hooks → extraerla a `src/lib/utils/`
- Si una validación se repite → usar el schema Zod de `src/lib/validators/`

### 2.4 Tipos antes que código
Antes de crear cualquier componente o servicio, verificar si el tipo ya existe en `src/types/`. Si no existe, crearlo ahí primero.

---

## 3. Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router (páginas solamente)
│   ├── (auth)/             # Login, forgot-password, reset, activate
│   └── (dashboard)/        # Todas las rutas protegidas con sidebar
│
├── components/
│   ├── ui/                 # Átomos reutilizables (Button, Input, Modal...)
│   ├── layout/             # Sidebar, Navbar, PageHeader
│   └── modules/            # Componentes específicos por módulo
│       ├── auth/
│       ├── organizaciones/
│       ├── contactos/
│       ├── pipeline/
│       ├── cotizaciones/
│       ├── notificaciones/
│       ├── plantillas/
│       ├── dashboard/
│       ├── datos/
│       └── control-acceso/
│
├── hooks/                  # Custom hooks por dominio (llaman a services)
├── services/
│   ├── api/                # client.ts + endpoints.ts
│   ├── mock/               # Data falsa por módulo
│   └── modules/            # Servicios reales (switch mock/api aquí)
│
├── store/                  # Zustand: auth.store, ui.store
├── types/                  # Interfaces y tipos TypeScript
├── lib/
│   ├── utils/              # Helpers puros (fechas, formato, csv)
│   ├── constants/          # routes.ts, queryKeys.ts, config.ts
│   └── validators/         # Schemas Zod por entidad
└── styles/                 # globals.css, design tokens
```

---

## 4. Convenciones de Código

### Nomenclatura
| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `LeadCard.tsx` |
| Hooks | camelCase + `use` | `useLeads.ts` |
| Servicios | camelCase + `.service` | `leads.service.ts` |
| Tipos | PascalCase + `.types` | `lead.types.ts` |
| Schemas Zod | camelCase + `.schema` | `lead.schema.ts` |
| Mocks | camelCase + `.mock` | `leads.mock.ts` |
| Stores | camelCase + `.store` | `auth.store.ts` |
| Utils | camelCase + `.utils` | `date.utils.ts` |
| Constantes | UPPER_SNAKE_CASE | `USE_MOCK`, `BASE_URL` |

### Componentes
```tsx
// ✅ Correcto: props tipadas, export named, sin lógica de negocio
interface LeadCardProps {
  lead: Lead
  onMove?: (leadId: number, newState: LeadState) => void
}

export function LeadCard({ lead, onMove }: LeadCardProps) {
  // Solo presentación
}

// ❌ Incorrecto: fetch dentro del componente, props sin tipo
export default function LeadCard({ lead, onMove }) {
  const data = await fetch('/api/leads') // NO
}
```

### Hooks
```ts
// ✅ Correcto: usa React Query, llama al service, no al endpoint directo
export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.leads.list(filters),
    queryFn: () => leadsService.getAll(filters),
  })
}
```

### Rutas centralizadas
```ts
// src/lib/constants/routes.ts
export const ROUTES = {
  auth: {
    login:          '/login',
    forgotPassword: '/forgot-password',
    resetPassword:  '/reset-password',
    activate:       '/activate',
  },
  dashboard:       '/dashboard',
  organizaciones:  '/organizaciones',
  organizacion:    (id: string) => `/organizaciones/${id}`,
  contactos:       '/contactos',
  contacto:        (id: number) => `/contactos/${id}`,
  pipeline:        '/pipeline',
  lead:            (id: number) => `/pipeline/${id}`,
  cotizaciones:    '/cotizaciones',
  cotizacion:      (id: number) => `/cotizaciones/${id}`,
  notificaciones:  '/notificaciones',
  plantillas:      '/plantillas',
  datos:           '/datos',
  controlAcceso:   '/control-acceso',
}
```

---

## 5. ENUMs del Sistema

Todos los ENUMs viven en `src/types/enums.ts`. **No redefinirlos en otro lugar.**

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

## 6. Control de Acceso por Rol

```ts
// src/lib/constants/config.ts
export const ADMIN_ONLY_ROUTES = [ROUTES.controlAcceso]

// src/app/(dashboard)/layout.tsx debe verificar:
// - Si la ruta es ADMIN_ONLY y el usuario es Trabajador → redirigir
// - Si no hay sesión → redirigir a login
```

Reglas de negocio de acceso:
- `control-acceso` → solo `Administrador`
- Resto de módulos → `Administrador` y `Trabajador`
- El sidebar debe ocultar `control-acceso` para `Trabajador`

---

## 7. Validaciones con Zod

Cada entidad tiene su schema en `src/lib/validators/`. Se usa con `react-hook-form`.

```ts
// src/lib/validators/lead.schema.ts
import { z } from 'zod'

export const leadSchema = z.object({
  id_org:           z.string().uuid('Organización requerida'),
  id_contacto:      z.number().optional(),
  servicio_interes: z.string().min(1, 'Campo obligatorio'),
  estado:           z.nativeEnum(LeadState).default(LeadState.Prospecto),
  comentarios:      z.string().max(500).optional(),
  id_encargado:     z.number({ required_error: 'Encargado requerido' }),
  canal_captacion:  z.string().max(60).optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
```

---

## 8. Data Mock

La data mock simula respuestas del backend. Debe ser **realista** (IDs, fechas, relaciones coherentes).

```ts
// src/services/mock/leads.mock.ts
import { Lead, LeadState } from '@/types'

export const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    id_org: 'uuid-org-1',
    estado: LeadState.Prospecto,
    servicio_interes: 'Formulación de proyecto I+D',
    id_encargado: 1,
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-01-15T08:00:00Z',
    // ...
  },
]

export const getLeads = (filters?: any) => {
  // Simular delay de red
  return new Promise<Lead[]>((resolve) =>
    setTimeout(() => resolve(MOCK_LEADS), 300)
  )
}
```

---

## 9. Reglas de Negocio Implementadas en Frontend

El frontend debe aplicar estas validaciones **antes** de llamar al backend:

| Regla | Dónde implementar |
|---|---|
| RN-003: No borrado físico de org/contacto/lead/cotización | Deshabilitar botón eliminar, solo desactivar |
| RN-007: Cotización aceptada → lead a Cierre con venta | En `cotizaciones.service.ts` post-save |
| RN-007: Cotización rechazada → lead a Cierre sin venta | En `cotizaciones.service.ts` post-save |
| RN-008: No nueva actividad si la anterior está Pendiente | Validar en `ActividadForm.tsx` antes de mostrar form |
| RN-009: Solo estados válidos del pipeline | Usar `LeadState` enum, no strings libres |
| RF-0062: Monto de cotización ≥ 0 | Schema Zod `cotizacion.schema.ts` |
| RF-0061: Una sola notificación por actividad | Verificar en `RecordatorioForm` / `SeguimientoForm` |
| RN-004: Sin RUC → código interno obligatorio | Lógica condicional en `OrganizacionForm.tsx` |
| RN-005: Contacto sin organización → bloquear | Validación en `contacto.schema.ts` |

---

## 10. Estilo Visual

- **Framework CSS**: Tailwind CSS
- **Design tokens**: `src/styles/themes/bioactiva.css`
- **Paleta**: Verde institucional como color primario (BioActiva = innovación + naturaleza)
- **Tipografía**: Variable en `globals.css`, nunca hardcodeada en componentes
- **Componentes UI**: Construidos sobre `src/components/ui/`, no usar librerías externas de UI sin consenso del equipo
- **Iconos**: Lucide React (`lucide-react`)
- **Gráficas**: Recharts (dashboard)
- **Drag & Drop (Kanban)**: `@dnd-kit/core`

---

## 11. Skills del Proyecto

### skill:mock-to-api
Cuando el backend entregue un endpoint:
1. Agregar la URL en `src/services/api/endpoints.ts`
2. Actualizar `src/services/modules/[modulo].service.ts` — el bloque `if (USE_MOCK)`
3. Probar con `USE_MOCK=false` en `.env.local`
4. No tocar componentes, hooks ni páginas

### skill:nuevo-modulo
Para agregar un nuevo módulo al CRM:
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
Para agregar un componente base reutilizable:
1. Crear carpeta `src/components/ui/[Nombre]/`
2. Archivos: `[Nombre].tsx`, `[Nombre].types.ts`, `index.ts`
3. Exportar desde `src/components/ui/index.ts`
4. Nunca incluir lógica de negocio ni llamadas a servicios

### skill:validacion-formulario
Para formularios con validación:
1. Definir o reutilizar schema Zod en `src/lib/validators/`
2. Usar `react-hook-form` con `zodResolver`
3. Mostrar errores inline, no como toast
4. Toast solo para éxito o error de red

---

## 12. React Query Keys

```ts
// src/lib/constants/queryKeys.ts
export const QUERY_KEYS = {
  auth:            { me: ['auth', 'me'] },
  usuarios:        { list: ['usuarios'] },
  organizaciones:  {
    list:   (f?: any) => ['organizaciones', 'list', f],
    detail: (id: string) => ['organizaciones', id],
  },
  contactos:       {
    list:   (f?: any) => ['contactos', 'list', f],
    detail: (id: number) => ['contactos', id],
  },
  leads:           {
    list:     (f?: any) => ['leads', 'list', f],
    pipeline: () => ['leads', 'pipeline'],
    detail:   (id: number) => ['leads', id],
  },
  actividades:     { byLead: (leadId: number) => ['actividades', leadId] },
  cotizaciones:    {
    list:   (f?: any) => ['cotizaciones', 'list', f],
    detail: (id: number) => ['cotizaciones', id],
  },
  notificaciones:  { list: (f?: any) => ['notificaciones', 'list', f] },
  plantillas:      { list: () => ['plantillas'] },
  dashboard:       { metricas: (f?: any) => ['dashboard', 'metricas', f] },
}
```

---

## 13. Variables de Entorno

```bash
# .env.example
NEXT_PUBLIC_USE_MOCK=true                     # true → mock | false → API real
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001 # URL del backend NestJS
NEXT_PUBLIC_APP_NAME=BioActiva CRM
```

---

## 14. Lo que NO hacer

- ❌ Nunca hacer `fetch` o `axios` directamente en componentes o páginas
- ❌ Nunca hardcodear URLs fuera de `endpoints.ts`
- ❌ Nunca hardcodear rutas fuera de `routes.ts`
- ❌ Nunca redefinir ENUMs fuera de `enums.ts`
- ❌ Nunca usar `any` sin justificación documentada
- ❌ Nunca crear tipos inline en componentes si ya existen en `src/types/`
- ❌ Nunca importar desde rutas relativas largas (`../../../../`); usar alias `@/`
- ❌ Nunca poner lógica de negocio en componentes UI de `src/components/ui/`
- ❌ Nunca eliminar físicamente organizaciones, contactos, leads o cotizaciones (RN-003)
<!-- END:nextjs-agent-rules -->
