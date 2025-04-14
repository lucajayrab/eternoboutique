import Link from "next/link"
import EternoLogo from "@/components/eterno-logo"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="mb-8">
        <EternoLogo width="60mm" inverted={true} />
      </div>

      <h2 className="text-2xl font-cormorant mb-4">Page Not Found</h2>
      <p className="mb-8 text-white/70">The page you are looking for does not exist.</p>

      <Link
        href="/"
        className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
