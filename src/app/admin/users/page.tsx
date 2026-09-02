import { prisma } from '@/lib/prisma'
import UsersClient from './users-client'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Format data for the client component
  const formattedUsers = users.map(user => ({
    id: user.id,
    name: user.name || 'مستخدم غير معروف',
    email: user.email || 'غير متوفر',
    joinedAt: new Date(user.createdAt).toLocaleDateString('ar-IQ'),
    role: user.role,
    status: 'نشط' // Assuming active since there's no status field in schema currently
  }))

  return <UsersClient initialUsers={formattedUsers} />
}
