import type { OrderStatus } from '@/types/firestore'

const statusToColor: Record<OrderStatus, string> = {
	'Pending Pickup': 'bg-amber-200 text-amber-900',
	'Picked Up': 'bg-indigo-200 text-indigo-800',
	'In Repair': 'bg-blue-200 text-blue-800',
	'Ready for Delivery': 'bg-purple-200 text-purple-800',
	'Delivered': 'bg-green-200 text-green-800',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
	return (
		<span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusToColor[status]}`}>
			{status}
		</span>
	)
}