import { PageHeader } from '@/components/layout/PageHeader'

export const metadata = {
    title: 'Dashboard | BioActiva CRM',
}

export default function DashboardPage() {
    return (
        <div>
            <PageHeader
                titulo="Dashboard"
                descripcion="Indicadores comerciales y métricas del pipeline"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Leads generados', valor: '--' },
                    { label: 'Tasa de conversión', valor: '--' },
                    { label: 'Monto en pipeline', valor: '--' },
                    { label: 'Ingresos cerrados', valor: '--' },
                ].map((kpi) => (
                    <div
                        key={kpi.label}
                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{kpi.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.valor}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-500 mb-4">
                    Pipeline comercial
                </p>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-sm text-gray-400">
                        Módulo en construcción
                    </p>
                </div>
            </div>
        </div>
    )
}