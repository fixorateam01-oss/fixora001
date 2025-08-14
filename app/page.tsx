import Link from 'next/link'

export default function HomePage() {
	return (
		<main className="mx-auto max-w-3xl px-6 py-16">
			<h1 className="text-3xl font-bold">Fixora</h1>
			<p className="mt-2 text-slate-600">Device repair with pickup & return in Kolkata. This is a placeholder. The final landing page will be replaced by the Lovable site.</p>
			<div className="mt-6 flex gap-3">
				<Link href="/book" className="rounded-md bg-slate-900 px-4 py-2 text-white">Book a Repair</Link>
				<Link href="/login" className="rounded-md border border-slate-300 px-4 py-2 text-slate-900">Login</Link>
			</div>
		</main>
	)
}