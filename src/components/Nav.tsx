import Link from 'next/link'
import { useAuth } from '../context/AuthProvider'

export default function Nav() {
  const { user, profile, loading, signOut } = useAuth()

  return (
    <nav className="w-full bg-white border-b">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link href="/"><a className="font-bold">RentDirect</a></Link>
          <Link href="/browse"><a className="text-sm text-gray-600">Browse</a></Link>
        </div>

        <div className="flex items-center gap-3">
          {!loading && profile?.role === 'landlord' && <Link href="/landlord/dashboard"><a className="text-sm">Dashboard</a></Link>}
          {!loading && profile?.role === 'admin' && <Link href="/admin/reports"><a className="text-sm">Admin</a></Link>}
          <Link href="/saved"><a className="text-sm">Saved</a></Link>

          {user ? (
            <>
              <span className="text-sm text-gray-600">{profile?.full_name || user.email}</span>
              <button onClick={() => signOut()} className="px-3 py-1 border rounded text-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login"><a className="px-3 py-1 border rounded text-sm">Sign in</a></Link>
              <Link href="/auth/signup"><a className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Sign up</a></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
