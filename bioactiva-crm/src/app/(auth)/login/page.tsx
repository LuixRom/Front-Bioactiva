import { Suspense } from 'react'
import { LoginForm } from '@/components/modules/auth/LoginForm'

export const metadata = {
  title: 'Iniciar sesión | BioActiva CRM',
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}