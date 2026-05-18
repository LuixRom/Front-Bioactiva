import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/modules/auth/ResetPasswordForm'

export const metadata = {
    title: 'Nueva contraseña | BioActiva CRM',
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    )
}