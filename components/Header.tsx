"use client"

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { getAuthClient } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

export function Header() {
	const { user, role } = useAuth()
	async function handleLogout() {
		await signOut(getAuthClient())
		if (typeof window !== 'undefined') window.location.href = '/'
	}
	return (
		<header className="border-b border-slate-200">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link href="/" className="font-bold">Fixora</Link>
				<nav className="flex items-center gap-4 text-sm text-slate-700">
					<Link href="/book">Book</Link>
					<Link href="/orders">Orders</Link>
					<Link href="/dashboard">Dashboard</Link>
					{role === 'rider' && <Link href="/rider">Rider</Link>}
					{role === 'technician' && <Link href="/technician">Technician</Link>}
					{role === 'admin' && <Link href="/admin/orders">Admin</Link>}
					<Link href="/profile">Profile</Link>
					{user ? (
						<button onClick={handleLogout} className="rounded border border-slate-300 px-3 py-1">Logout</button>
					) : (
						<Link href="/login">Login</Link>
					)}
				</nav>
			</div>
		</header>
	)
}