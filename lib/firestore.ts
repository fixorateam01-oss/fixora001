import { getFirestoreClient } from './firebase'
import { addDoc, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import type { LocationDoc, OrderDoc, StatusLogDoc, UserDoc, UserRole } from '@/types/firestore'

export async function createUserProfileIfMissing(user: { uid: string; email?: string | null; phoneNumber?: string | null; displayName?: string | null }) {
	const db = getFirestoreClient()
	const ref = doc(db, 'users', user.uid)
	await setDoc(ref, {
		uid: user.uid,
		email: user.email ?? undefined,
		phone: user.phoneNumber ?? undefined,
		name: user.displayName ?? 'User',
		role: 'customer',
		createdAt: Date.now(),
	} satisfies UserDoc, { merge: true })
}

export async function createOrder(order: Omit<OrderDoc, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
	const db = getFirestoreClient()
	const col = collection(db, 'orders')
	const now = Date.now()
	const docRef = await addDoc(col, { ...order, status: 'Pending Pickup', createdAt: now, updatedAt: now })
	await addStatusLog({ orderId: docRef.id, status: 'Pending Pickup', updatedBy: order.customerId })
	return docRef.id
}

export async function addStatusLog({ orderId, status, updatedBy, proofUrls }: { orderId: string; status: OrderDoc['status']; updatedBy: string; proofUrls?: string[] }) {
	const db = getFirestoreClient()
	const col = collection(db, 'statusLogs')
	await addDoc(col, { orderId, status, updatedBy, proofUrls, timestamp: Date.now() } as StatusLogDoc)
}

export function listenOrdersByCustomer(customerId: string, cb: (orders: OrderDoc[]) => void) {
	const db = getFirestoreClient()
	const q = query(collection(db, 'orders'), where('customerId', '==', customerId))
	return onSnapshot(q, (snap) => {
		const data: OrderDoc[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
		cb(data)
	})
}

export function listenOrdersByAssignedRider(riderId: string, cb: (orders: OrderDoc[]) => void) {
	const db = getFirestoreClient()
	const q = query(collection(db, 'orders'), where('assignedRiderId', '==', riderId))
	return onSnapshot(q, (snap) => {
		const data: OrderDoc[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
		cb(data)
	})
}

export function listenOrdersByAssignedTechnician(technicianId: string, cb: (orders: OrderDoc[]) => void) {
	const db = getFirestoreClient()
	const q = query(collection(db, 'orders'), where('assignedTechnicianId', '==', technicianId))
	return onSnapshot(q, (snap) => {
		const data: OrderDoc[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
		cb(data)
	})
}

export function listenAllOrders(cb: (orders: OrderDoc[]) => void) {
	const db = getFirestoreClient()
	const q = query(collection(db, 'orders'))
	return onSnapshot(q, (snap) => {
		const data: OrderDoc[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
		cb(data)
	})
}

export async function listUsersByRole(role: UserRole): Promise<UserDoc[]> {
	const db = getFirestoreClient()
	const q = query(collection(db, 'users'), where('role', '==', role))
	const snap = await getDocs(q)
	return snap.docs.map(d => d.data() as UserDoc)
}

export async function assignOrder(orderId: string, updates: { assignedRiderId?: string | null; assignedTechnicianId?: string | null }) {
	const db = getFirestoreClient()
	const payload: any = { updatedAt: Date.now() }
	if (updates.assignedRiderId !== undefined) payload.assignedRiderId = updates.assignedRiderId
	if (updates.assignedTechnicianId !== undefined) payload.assignedTechnicianId = updates.assignedTechnicianId
	await updateDoc(doc(db, 'orders', orderId), payload)
}

export async function updateOrderStatus(orderId: string, status: OrderDoc['status'], updatedBy: string, proofUrls?: string[]) {
	const db = getFirestoreClient()
	await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: Date.now() })
	await addStatusLog({ orderId, status, updatedBy, proofUrls })
}

export async function upsertLocation(update: Omit<LocationDoc, 'id'>) {
	const db = getFirestoreClient()
	const ref = doc(db, 'locations', update.orderId)
	await setDoc(ref, { ...update }, { merge: true })
}