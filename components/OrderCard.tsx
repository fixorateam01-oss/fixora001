import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import type { OrderDoc } from '@/types/firestore'

export function OrderCard({ order }: { order: OrderDoc }) {
	return (
		<div className="rounded-lg border border-slate-200 p-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-medium">{order.deviceType} — {order.brand} {order.model}</h3>
					<p className="text-sm text-slate-600">{order.issueDescription}</p>
				</div>
				<StatusBadge status={order.status} />
			</div>
			<div className="mt-3 flex items-center justify-between text-sm text-slate-600">
				<p>Pickup: {order.pickupAddress}</p>
				<Link href={`/track/${order.id}`} className="text-slate-900 underline">Track</Link>
			</div>
		</div>
	)
}