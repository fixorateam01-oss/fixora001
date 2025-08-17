"use client"

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { OrderDoc } from '@/types/firestore'
import { listenOrdersByAssignedRider, updateOrderStatus, upsertLocation } from '@/lib/firestore'
import { FileUploader } from '@/components/FileUploader'

function RiderLocationPusher({ orderId, riderId }: { orderId: string; riderId: string }) {
	const [sharing, setSharing] = useState(false)
	useEffect(() => {
		if (!sharing) return
		let watchId: number | null = null
		if (navigator.geolocation) {
			watchId = navigator.geolocation.watchPosition(
				(pos) => {
					upsertLocation({ orderId, riderId, lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: Date.now() })
				},
				() => {},
				{ enableHighAccuracy: true, maximumAge: 5000 }
			)
		}
		return () => { if (watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId) }
	}, [sharing, orderId, riderId])
	return (
		<button onClick={() => setSharing((s) => !s)} className="rounded border border-slate-300 px-3 py-1 text-sm">
			{sharing ? 'Stop Location' : 'Share Location'}
		</button>
	)
}

export default function RiderPage() {
	const { user } = useAuth()
	const [orders, setOrders] = useState<OrderDoc[]>([])
	const riderId = user?.uid

	useEffect(() => {
		if (!riderId) return
		const unsub = listenOrdersByAssignedRider(riderId, setOrders)
		return () => unsub()
	}, [riderId])

	async function markPickedUp(order: OrderDoc, proofUrls?: string[]) {
		if (!riderId) return
		await updateOrderStatus(order.id, 'Picked Up', riderId, proofUrls)
	}
	async function markDelivered(order: OrderDoc, proofUrls?: string[]) {
		if (!riderId) return
		await updateOrderStatus(order.id, 'Delivered', riderId, proofUrls)
	}

	return (
		<main className="mx-auto max-w-4xl px-6 py-12">
			<h1 className="text-2xl font-semibold">Rider Jobs</h1>
			<div className="mt-4 grid gap-4">
				{orders.map((o) => (
					<div key={o.id} className="rounded border border-slate-200 p-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">{o.deviceType} — {o.brand} {o.model}</h3>
								<p className="text-sm text-slate-600">{o.pickupAddress} → {o.deliveryAddress}</p>
							</div>
							{riderId && <RiderLocationPusher orderId={o.id} riderId={riderId} />}
						</div>
						<div className="mt-3 grid gap-2">
							{o.status === 'Pending Pickup' && (
								<ActionWithProof label="Mark Picked Up" onConfirm={(proof) => markPickedUp(o, proof)} />
							)}
							{o.status === 'Ready for Delivery' && (
								<ActionWithProof label="Mark Delivered" onConfirm={(proof) => markDelivered(o, proof)} />
							)}
						</div>
					</div>
				))}
				{orders.length === 0 && <p className="text-slate-600">No assigned jobs.</p>}
			</div>
		</main>
	)
}

function ActionWithProof({ label, onConfirm }: { label: string; onConfirm: (urls?: string[]) => void }) {
	const [proof, setProof] = useState<string[]>([])
	const [submitting, setSubmitting] = useState(false)
	return (
		<div className="flex items-center gap-2">
			<FileUploader onUploaded={(urls) => setProof((p) => [...p, ...urls])} />
			<button disabled={submitting} onClick={async () => { setSubmitting(true); await onConfirm(proof); setSubmitting(false); }} className="rounded bg-slate-900 px-3 py-1 text-white disabled:opacity-50">
				{submitting ? 'Saving...' : label}
			</button>
		</div>
	)
}