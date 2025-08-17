"use client"

import { useEffect, useMemo, useState } from 'react'
import type { OrderDoc, UserDoc } from '@/types/firestore'
import { assignOrder, listUsersByRole, listenAllOrders, updateOrderStatus } from '@/lib/firestore'

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<OrderDoc[]>([])
	const [riders, setRiders] = useState<UserDoc[]>([])
	const [techs, setTechs] = useState<UserDoc[]>([])

	useEffect(() => {
		const unsub = listenAllOrders(setOrders)
		listUsersByRole('rider').then(setRiders)
		listUsersByRole('technician').then(setTechs)
		return () => unsub()
	}, [])

	async function handleAssign(orderId: string, field: 'assignedRiderId' | 'assignedTechnicianId', value: string | '') {
		await assignOrder(orderId, { [field]: value || null } as any)
	}

	async function handleStatus(orderId: string, status: OrderDoc['status']) {
		await updateOrderStatus(orderId, status, 'admin')
	}

	const statuses: OrderDoc['status'][] = ['Pending Pickup','Picked Up','In Repair','Ready for Delivery','Delivered']

	return (
		<main className="mx-auto max-w-6xl px-6 py-12">
			<h1 className="text-2xl font-semibold">Admin — Orders</h1>
			<div className="mt-6 overflow-x-auto">
				<table className="min-w-full text-left text-sm">
					<thead className="bg-slate-50 text-slate-700">
						<tr>
							<th className="px-3 py-2">Order</th>
							<th className="px-3 py-2">Customer</th>
							<th className="px-3 py-2">Rider</th>
							<th className="px-3 py-2">Technician</th>
							<th className="px-3 py-2">Status</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((o) => (
							<tr key={o.id} className="border-b">
								<td className="px-3 py-2 font-medium">{o.deviceType} {o.brand} {o.model}</td>
								<td className="px-3 py-2 text-slate-600">{o.customerId}</td>
								<td className="px-3 py-2">
									<select defaultValue={o.assignedRiderId ?? ''} onChange={(e) => handleAssign(o.id, 'assignedRiderId', e.target.value)} className="rounded border border-slate-300 px-2 py-1">
										<option value="">Unassigned</option>
										{riders.map(r => <option key={r.uid} value={r.uid}>{r.name || r.uid}</option>)}
									</select>
								</td>
								<td className="px-3 py-2">
									<select defaultValue={o.assignedTechnicianId ?? ''} onChange={(e) => handleAssign(o.id, 'assignedTechnicianId', e.target.value)} className="rounded border border-slate-300 px-2 py-1">
										<option value="">Unassigned</option>
										{techs.map(t => <option key={t.uid} value={t.uid}>{t.name || t.uid}</option>)}
									</select>
								</td>
								<td className="px-3 py-2">
									<select defaultValue={o.status} onChange={(e) => handleStatus(o.id, e.target.value as OrderDoc['status'])} className="rounded border border-slate-300 px-2 py-1">
										{statuses.map(s => <option key={s} value={s}>{s}</option>)}
									</select>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	)
}