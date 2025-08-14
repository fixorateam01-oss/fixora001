export type UserRole = 'customer' | 'rider' | 'technician' | 'admin'

export interface UserDoc {
	uid: string
	name: string
	role: UserRole
	phone?: string
	email?: string
	address?: string
	photoURL?: string
}

export type OrderStatus =
	| 'created'
	| 'pickup_assigned'
	| 'pickup_in_progress'
	| 'picked_up'
	| 'in_repair_queue'
	| 'repair_in_progress'
	| 'repaired'
	| 'delivery_assigned'
	| 'out_for_delivery'
	| 'delivered'
	| 'cancelled'

export interface OrderDoc {
	id: string
	customerId: string
	deviceType: string
	brand: string
	model: string
	issue: string
	photos: string[]
	status: OrderStatus
	pickupAddress: string
	deliveryAddress: string
	assignedRiderId?: string
	assignedTechnicianId?: string
	createdAt: number
	updatedAt: number
}

export interface StatusLogDoc {
	id: string
	orderId: string
	status: OrderStatus
	timestamp: number
	updatedBy: string
}

export interface LocationUpdateDoc {
	id: string
	orderId: string
	riderId: string
	lat: number
	lng: number
	timestamp: number
}