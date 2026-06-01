import { USE_MOCK } from '@/lib/constants/config'
import { ENDPOINTS } from '@/services/api/endpoints'
import { apiClient } from '@/services/api/client'
import {
  mockGetCotizaciones,
  mockGetCotizacion,
  mockCreateCotizacion,
  mockUpdateCotizacion,
  mockGetKpis,
} from '@/services/mock/cotizaciones.mock'
import { leadsService } from '@/services/modules/leads.service'
import { getLeadStateFromCotizacion } from '@/lib/utils/lead-flow.utils'
import {
  Cotizacion,
  CotizacionFiltros,
  CotizacionesResponse,
  CotizacionFormData,
  CotizacionKpis,
} from '@/types/cotizacion.types'

async function syncLeadEstadoFromCotizacion(cotizacion: Cotizacion) {
  const leadState = getLeadStateFromCotizacion(cotizacion.estado)
  if (!leadState) return
  await leadsService.updateEstado(cotizacion.id_lead, leadState)
}

export const cotizacionesService = {

  getAll: async (filtros?: CotizacionFiltros): Promise<CotizacionesResponse> => {
    if (USE_MOCK) return mockGetCotizaciones(filtros)
    const response = await apiClient.get<CotizacionesResponse>(
      ENDPOINTS.cotizaciones.list,
      { params: filtros }
    )
    return response.data
  },

  getById: async (id: number): Promise<Cotizacion> => {
    if (USE_MOCK) return mockGetCotizacion(id)
    const response = await apiClient.get<Cotizacion>(
      ENDPOINTS.cotizaciones.detail(id)
    )
    return response.data
  },

  create: async (data: CotizacionFormData): Promise<Cotizacion> => {
    const cotizacion = USE_MOCK
      ? await mockCreateCotizacion(data)
      : (await apiClient.post<Cotizacion>(
          ENDPOINTS.cotizaciones.create,
          data
        )).data

    await syncLeadEstadoFromCotizacion(cotizacion)
    return cotizacion
  },

  update: async (
    id: number,
    data: Partial<CotizacionFormData>
  ): Promise<Cotizacion> => {
    const cotizacion = USE_MOCK
      ? await mockUpdateCotizacion(id, data)
      : (await apiClient.patch<Cotizacion>(
          ENDPOINTS.cotizaciones.update(id),
          data
        )).data

    await syncLeadEstadoFromCotizacion(cotizacion)
    return cotizacion
  },

  getKpis: async (): Promise<CotizacionKpis> => {
    if (USE_MOCK) return mockGetKpis()
    const response = await apiClient.get<CotizacionKpis>(
      '/api/cotizaciones/kpis'
    )
    return response.data
  },

  getByLead: async (leadId: number): Promise<Cotizacion[]> => {
    if (USE_MOCK) {
      const response = await mockGetCotizaciones()
      return response.data.filter((c) => c.id_lead === leadId)
    }
    const response = await apiClient.get<Cotizacion[]>(
      ENDPOINTS.cotizaciones.byLead(leadId)
    )
    return response.data
  },
}
