"use client"

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
	const { role } = useAuth()
	return (
		<main className="mx-auto max-w-5xl px-6 py-12">
			<h1 className="text-2xl font-semibold">Dashboard</h1>
			<div className="mt-4 grid gap-3">
				{role === 'customer' && (
					<div className="grid gap-2">
						<Link className="underline" href="/orders">My Orders</Link>
						<Link className="underline" href="/book">Book a Repair</Link>
					</div>
				)}
				{role === 'rider' && <p>Rider jobs page coming up at /rider</p>}
				{role === 'technician' && <p>Technician repairs page coming up at /technician</p>}
				{role === 'admin' && <Link className="underline" href="/admin/orders">Admin Orders</Link>}
			</div>
		</main>
	)
}