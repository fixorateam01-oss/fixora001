"use client"

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types/firestore'

export default function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
	const router = useRouter()
	const { loading, user, role } = useAuth()

	useEffect(() => {
		if (loading) return
		if (!user) {
			router.replace('/login')
			return
		}
		if (!role || !roles.includes(role)) {
			router.replace('/dashboard')
		}
	}, [loading, user, role, roles, router])

	return <>{children}</>
}