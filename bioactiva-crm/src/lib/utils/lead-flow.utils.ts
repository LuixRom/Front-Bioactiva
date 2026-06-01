import { Cotizacion } from '@/types/cotizacion.types'
import { EstadoCot, LeadState } from '@/types/enums'

export interface LeadTransitionGuard {
  allowed: boolean
  reason?: string
}

export function getLeadStateFromCotizacion(
  estado: EstadoCot
): LeadState | null {
  if (estado === EstadoCot.Aceptada) return LeadState.CierreVenta
  if (estado === EstadoCot.Rechazada) return LeadState.CierreSinVenta
  return null
}

export function validateLeadStateTransition(
  targetState: LeadState,
  cotizaciones: Cotizacion[]
): LeadTransitionGuard {
  if (targetState === LeadState.Prospecto) {
    return { allowed: true }
  }

  if (targetState === LeadState.Ofertado) {
    const hasCotizacion = cotizaciones.length > 0
    return hasCotizacion
      ? { allowed: true }
      : {
          allowed: false,
          reason: 'Para pasar a Ofertado registra primero una cotización asociada al lead.',
        }
  }

  if (targetState === LeadState.CierreVenta) {
    const hasAccepted = cotizaciones.some(
      (cotizacion) => cotizacion.estado === EstadoCot.Aceptada
    )
    return hasAccepted
      ? { allowed: true }
      : {
          allowed: false,
          reason: 'Para cerrar con venta debe existir una cotización aceptada.',
        }
  }

  if (targetState === LeadState.CierreSinVenta) {
    const hasRejected = cotizaciones.some(
      (cotizacion) => cotizacion.estado === EstadoCot.Rechazada
    )
    return hasRejected
      ? { allowed: true }
      : {
          allowed: false,
          reason: 'Para cerrar sin venta debe existir una cotización rechazada.',
        }
  }

  return { allowed: false, reason: 'Estado de pipeline no válido.' }
}
