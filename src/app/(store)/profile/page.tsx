import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProfileClient from './profile-client'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return <ProfileClient user={session.user} orders={orders} />
}
