import { redirect } from 'next/navigation'
import { getAdminPassword } from '@/lib/admin'
import { AdminClient } from './admin-client'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const pwd = await getAdminPassword()
  if (!pwd) redirect('/admin/login')
  return <AdminClient />
}
