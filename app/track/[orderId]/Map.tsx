"use client"

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { getFirestoreClient } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

export default function MapTracker({ orderId }: { orderId: string }) {
	const mapRef = useRef<HTMLDivElement | null>(null)
	const markerRef = useRef<any>(null)
	const mapInstanceRef = useRef<any>(null)

	useEffect(() => {
		let unsub: (() => void) | undefined
		async function init() {
			const loader = new Loader({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, version: 'weekly' })
			await loader.load()
			// @ts-ignore
			const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
				center: { lat: 22.5726, lng: 88.3639 },
				zoom: 12,
			})
			mapInstanceRef.current = map
			const db = getFirestoreClient()
			const locRef = doc(db, 'locations', orderId)
			unsub = onSnapshot(locRef, (snap) => {
				const data = snap.data() as any
				if (!data) return
				const pos = { lat: data.lat, lng: data.lng }
				if (!markerRef.current) {
					// @ts-ignore
					markerRef.current = new google.maps.Marker({ position: pos, map, title: 'Rider' })
					map.panTo(pos)
				} else {
					markerRef.current.setPosition(pos)
				}
			})
		}
		init()
		return () => { unsub?.() }
	}, [orderId])

	return (
		<div ref={mapRef} className="h-80 w-full rounded-lg border border-slate-200" />
	)
}