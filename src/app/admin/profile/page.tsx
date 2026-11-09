import React from 'react'
import ProfileClient from './profile-client'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/admin-login')
  if (session.user.role === 'CUSTOMER') redirect('/')

  let currentUser = null
  let staffUsers: any[] = []
  try {
    currentUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    })

    staffUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Failed to fetch profile data:', error)
  }

  return <ProfileClient currentUser={currentUser} initialStaffUsers={staffUsers} />
}
