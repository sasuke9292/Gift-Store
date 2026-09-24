import { FavoritesClient } from "./favorites-client"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'المفضلة | گفتي بلس',
  description: 'قائمة الهدايا المفضلة لديك في متجر گفتي بلس',
}

export default function FavoritesPage() {
  return <FavoritesClient />
}
