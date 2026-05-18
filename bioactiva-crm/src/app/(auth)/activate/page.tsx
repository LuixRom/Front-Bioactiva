import { Suspense } from 'react'
import { ActivateAccountForm } from '@/components/modules/auth/ActivateAccountForm'

export const metadata = {
    title: 'Activar cuenta | BioActiva CRM',
}

export default function ActivatePage() {
    return (
        <Suspense>
            <ActivateAccountForm />
        </Suspense>
    )
}