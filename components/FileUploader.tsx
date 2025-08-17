"use client"

import { useState } from 'react'
import { getStorageClient } from '@/lib/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export function FileUploader({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (!files || files.length === 0) return
		setUploading(true)
		setError(null)
		try {
			const storage = getStorageClient()
			const urls: string[] = []
			for (const file of Array.from(files)) {
				const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
				const storageRef = ref(storage, path)
				await uploadBytes(storageRef, file)
				const url = await getDownloadURL(storageRef)
				urls.push(url)
			}
			onUploaded(urls)
		} catch (err: any) {
			setError(err?.message ?? 'Upload failed')
		} finally {
			setUploading(false)
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<input type="file" multiple onChange={handleChange} accept="image/*" />
			{uploading && <p className="text-sm text-slate-600">Uploading...</p>}
			{error && <p className="text-sm text-rose-600">{error}</p>}
		</div>
	)
}