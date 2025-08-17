"use client"

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { createOrder } from '@/lib/firestore'
import { useAuth } from '@/context/AuthContext'

export default function BookPage() {
	const { user } = useAuth()
	const [deviceType, setDeviceType] = useState('Mobile')
	const [brand, setBrand] = useState('')
	const [model, setModel] = useState('')
	const [issueDescription, setIssueDescription] = useState('')
	const [pickupAddress, setPickupAddress] = useState('')
	const [deliveryAddress, setDeliveryAddress] = useState('')
	const [issuePhotos, setIssuePhotos] = useState<string[]>([])
	const [submitting, setSubmitting] = useState(false)
	const [successId, setSuccessId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!user) {
			setError('Please login first')
			return
		}
		setSubmitting(true)
		setError(null)
		try {
			const id = await createOrder({
				customerId: user.uid,
				deviceType,
				brand,
				model,
				issueDescription,
				issuePhotos,
				pickupAddress,
				deliveryAddress,
				assignedRiderId: undefined,
				assignedTechnicianId: undefined,
			})
			setSuccessId(id)
		} catch (err: any) {
			setError(err?.message ?? 'Failed to create order')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<main className="mx-auto max-w-2xl px-6 py-12">
			<h1 className="text-2xl font-semibold">Book a Repair</h1>
			<form onSubmit={handleSubmit} className="mt-6 grid gap-4">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<label className="grid gap-1 text-sm">
						<span>Device Type</span>
						<select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} className="rounded border border-slate-300 px-3 py-2">
							<option>Mobile</option>
							<option>Laptop</option>
							<option>Tablet</option>
						</select>
					</label>
					<label className="grid gap-1 text-sm">
						<span>Brand</span>
						<input value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded border border-slate-300 px-3 py-2" required />
					</label>
					<label className="grid gap-1 text-sm">
						<span>Model</span>
						<input value={model} onChange={(e) => setModel(e.target.value)} className="rounded border border-slate-300 px-3 py-2" required />
					</label>
					<label className="grid gap-1 text-sm">
						<span>Issue</span>
						<textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} className="min-h-[96px] rounded border border-slate-300 px-3 py-2" required />
					</label>
				</div>

				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<label className="grid gap-1 text-sm">
						<span>Pickup Address</span>
						<input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} className="rounded border border-slate-300 px-3 py-2" required />
					</label>
					<label className="grid gap-1 text-sm">
						<span>Delivery Address</span>
						<input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="rounded border border-slate-300 px-3 py-2" required />
					</label>
				</div>

				<div className="grid gap-2">
					<span className="text-sm">Issue Photos</span>
					<FileUploader onUploaded={(urls) => setIssuePhotos((prev) => [...prev, ...urls])} />
					{issuePhotos.length > 0 && (
						<div className="mt-2 grid grid-cols-3 gap-2">
							{issuePhotos.map((u) => (
								<img key={u} src={u} alt="uploaded" className="h-24 w-full rounded object-cover" />
							))}
						</div>
					)}
				</div>

				<div className="mt-4 flex items-center gap-3">
					<button disabled={submitting} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit'}</button>
					{error && <span className="text-sm text-rose-600">{error}</span>}
					{successId && <a className="text-sm text-green-700 underline" href={`/track/${successId}`}>View Tracking</a>}
				</div>
			</form>
		</main>
	)
}