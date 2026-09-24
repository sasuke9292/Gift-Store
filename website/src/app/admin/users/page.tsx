import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import UsersClient from './users-client'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/admin-login')
  if (session.user.role === 'CUSTOMER') redirect('/')

  let formattedUsers: any[] = []
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format data for the client component
    formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'مستخدم غير معروف',
      email: user.email || 'غير متوفر',
      joinedAt: new Date(user.createdAt).toLocaleDateString('ar-IQ'),
      role: user.role,
      status: 'نشط'
    }))
  } catch (error) {
    console.error('Failed to fetch admin users:', error)
  }

  return <UsersClient initialUsers={formattedUsers} />
}
