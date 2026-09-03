import { FavoritesClient } from "./favorites-client"

export const metadata = {
  title: 'المفضلة | گفتي بلس',
  description: 'قائمة الهدايا المفضلة لديك',
}

export default function FavoritesPage() {
  return (
    <div className="bg-[#050B14] min-h-screen pt-48 pb-32 relative overflow-hidden text-white">
      {/* 3D Depth Background */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <FavoritesClient />
    </div>
  )
}
