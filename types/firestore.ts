export type UserRole = 'customer' | 'rider' | 'technician' | 'admin'

export interface UserDoc {
	uid: string
	name: string
	email?: string
	phone?: string
	role: UserRole
	address?: string
	photoURL?: string
	createdAt?: number
}

export type OrderStatus =
	| 'Pending Pickup'
	| 'Picked Up'
	| 'In Repair'
	| 'Ready for Delivery'
	| 'Delivered'

export interface OrderDoc {
	id: string
	customerId: string
	deviceType: string
	brand: string
	model: string
	issueDescription: string
	issuePhotos: string[]
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
	updatedBy: string
	proofUrls?: string[]
	timestamp: number
}

export interface LocationDoc {
	id: string
	orderId: string
	riderId: string
	lat: number
	lng: number
	timestamp: number
}