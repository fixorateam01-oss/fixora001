import Link from 'next/link'

export function Header() {
	return (
		<header className="border-b border-slate-200">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link href="/" className="font-bold">Fixora</Link>
				<nav className="flex items-center gap-4 text-sm text-slate-700">
					<Link href="/book">Book</Link>
					<Link href="/dashboard">Dashboard</Link>
					<Link href="/profile">Profile</Link>
					<Link href="/login">Login</Link>
				</nav>
			</div>
		</header>
	)
}