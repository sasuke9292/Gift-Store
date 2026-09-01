import { FavoritesClient } from "./favorites-client"

export const metadata = {
  title: 'المفضلة | گفتي بلس',
  description: 'قائمة الهدايا المفضلة لديك',
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFD]">
      <FavoritesClient />
    </div>
  )
}
