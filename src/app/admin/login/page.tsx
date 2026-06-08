import { redirect } from 'next/navigation'
import { getAdminPassword } from '@/lib/admin'
import { AdminLoginForm } from './login-form'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const pwd = await getAdminPassword()
  if (pwd) redirect('/inbox')
  return <AdminLoginForm />
}
