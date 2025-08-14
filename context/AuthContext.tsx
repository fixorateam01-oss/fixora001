"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { getAuthClient, getFirestoreClient } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import type { UserDoc, UserRole } from '@/types/firestore'

interface AuthContextValue {
	loading: boolean
	user: User | null
	profile: UserDoc | null
	role: UserRole | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [profile, setProfile] = useState<UserDoc | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Client-only
		if (typeof window === 'undefined') return
		const auth = getAuthClient()
		const db = getFirestoreClient()
		const unsub = onAuthStateChanged(auth, async (nextUser) => {
			setUser(nextUser)
			if (nextUser) {
				const profileRef = doc(db, 'users', nextUser.uid)
				const snap = await getDoc(profileRef)
				if (snap.exists()) {
					setProfile(snap.data() as UserDoc)
				} else {
					setProfile(null)
				}
			} else {
				setProfile(null)
			}
			setLoading(false)
		})
		return () => unsub()
	}, [])

	const value = useMemo<AuthContextValue>(() => ({
		loading,
		user,
		profile,
		role: profile?.role ?? null,
	}), [loading, user, profile])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}