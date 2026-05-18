import { Suspense } from 'react'
import { ForgotPasswordForm } from '@/components/modules/auth/ForgotPasswordForm'

export const metadata = {
    title: 'Recuperar contraseña | BioActiva CRM',
}

export default function ForgotPasswordPage() {
    return (
        <Suspense>
            <ForgotPasswordForm />
        </Suspense>
    )
}