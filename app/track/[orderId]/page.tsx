interface Props {
	params: { orderId: string }
}

export default function TrackOrderPage({ params }: Props) {
	return (
		<main className="mx-auto max-w-4xl px-6 py-12">
			<h1 className="text-2xl font-semibold">Track Order</h1>
			<p className="mt-1 text-slate-600">Order ID: <span className="font-mono">{params.orderId}</span></p>
			<div className="mt-6 grid gap-6 md:grid-cols-2">
				<div className="rounded-lg border border-slate-200 p-4">
					<h2 className="font-medium">Live Status</h2>
					<p className="mt-1 text-sm text-slate-600">Real-time status updates will appear here.</p>
				</div>
				{/* Map */}
				<div>
					{/* Will be replaced with Google Maps JS API */}
					<div className="h-80 w-full rounded-lg border border-slate-200 bg-slate-100" />
				</div>
			</div>
		</main>
	)
}