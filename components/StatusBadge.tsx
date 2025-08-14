import type { OrderStatus } from '@/types/firestore'

const statusToColor: Record<OrderStatus, string> = {
	created: 'bg-slate-200 text-slate-800',
	pickup_assigned: 'bg-blue-200 text-blue-800',
	pickup_in_progress: 'bg-blue-200 text-blue-800',
	picked_up: 'bg-indigo-200 text-indigo-800',
	in_repair_queue: 'bg-amber-200 text-amber-900',
	repair_in_progress: 'bg-amber-200 text-amber-900',
	repaired: 'bg-green-200 text-green-800',
	delivery_assigned: 'bg-purple-200 text-purple-800',
	out_for_delivery: 'bg-purple-200 text-purple-800',
	delivered: 'bg-green-200 text-green-800',
	cancelled: 'bg-rose-200 text-rose-800',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
	return (
		<span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusToColor[status]}`}>
			{status.replaceAll('_', ' ')}
		</span>
	)
}