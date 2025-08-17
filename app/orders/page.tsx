"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { OrderDoc } from '@/types/firestore'
import { listenOrdersByCustomer } from '@/lib/firestore'
import { OrderCard } from '@/components/OrderCard'

export default function OrdersPage() {
	const { user } = useAuth()
	const [orders, setOrders] = useState<OrderDoc[]>([])

	useEffect(() => {
		if (!user) return
		const unsub = listenOrdersByCustomer(user.uid, setOrders)
		return () => unsub()
	}, [user])

	return (
		<main className="mx-auto max-w-3xl px-6 py-12">
			<h1 className="text-2xl font-semibold">My Orders</h1>
			<div className="mt-6 grid gap-4">
				{orders.map((o) => (
					<OrderCard key={o.id} order={o} />
				))}
				{orders.length === 0 && <p className="text-slate-600">No orders yet.</p>}
			</div>
		</main>
	)
}