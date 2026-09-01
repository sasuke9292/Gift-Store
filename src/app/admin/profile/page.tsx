import React from 'react'
import ProfileClient from './profile-client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  
  // We mock a user for now since we don't have a full auth setup working perfectly in dev yet.
  let currentUser = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  })

  const staffUsers = await prisma.user.findMany({
    where: {
      role: {
        not: 'CUSTOMER'
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <ProfileClient currentUser={currentUser} initialStaffUsers={staffUsers} />
}
