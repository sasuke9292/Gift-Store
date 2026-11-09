import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function AdminHeroSlidesPage() {
  redirect('/admin/settings?tab=slides')
}
