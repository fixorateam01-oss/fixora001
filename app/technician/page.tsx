"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { OrderDoc } from '@/types/firestore'
import { listenOrdersByAssignedTechnician, updateOrderStatus } from '@/lib/firestore'

export default function TechnicianPage() {
	const { user } = useAuth()
	const [orders, setOrders] = useState<OrderDoc[]>([])
	const techId = user?.uid

	useEffect(() => {
		if (!techId) return
		const unsub = listenOrdersByAssignedTechnician(techId, setOrders)
		return () => unsub()
	}, [techId])

	async function startRepair(order: OrderDoc) {
		if (!techId) return
		await updateOrderStatus(order.id, 'In Repair', techId)
	}
	async function markReady(order: OrderDoc) {
		if (!techId) return
		await updateOrderStatus(order.id, 'Ready for Delivery', techId)
	}

	return (
		<main className="mx-auto max-w-4xl px-6 py-12">
			<h1 className="text-2xl font-semibold">Technician Repairs</h1>
			<div className="mt-4 grid gap-4">
				{orders.map((o) => (
					<div key={o.id} className="rounded border border-slate-200 p-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">{o.deviceType} — {o.brand} {o.model}</h3>
								<p className="text-sm text-slate-600">{o.issueDescription}</p>
							</div>
							<div className="flex gap-2">
								{o.status === 'Picked Up' && (
									<button onClick={() => startRepair(o)} className="rounded bg-slate-900 px-3 py-1 text-white">Start Repair</button>
								)}
								{o.status === 'In Repair' && (
									<button onClick={() => markReady(o)} className="rounded bg-green-700 px-3 py-1 text-white">Mark Ready</button>
								)}
							</div>
						</div>
					</div>
				))}
				{orders.length === 0 && <p className="text-slate-600">No assigned repairs.</p>}
			</div>
		</main>
	)
}