import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let cachedApp: FirebaseApp | null = null
let cachedAuth: Auth | null = null
let cachedDb: Firestore | null = null
let cachedStorage: FirebaseStorage | null = null

export function getFirebaseApp(): FirebaseApp {
	if (cachedApp) return cachedApp
	if (typeof window === 'undefined') {
		throw new Error('Firebase app is not available on the server')
	}
	cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
	return cachedApp
}

export function getAuthClient(): Auth {
	if (!cachedAuth) cachedAuth = getAuth(getFirebaseApp())
	return cachedAuth
}

export function getFirestoreClient(): Firestore {
	if (!cachedDb) cachedDb = getFirestore(getFirebaseApp())
	return cachedDb
}

export function getStorageClient(): FirebaseStorage {
	if (!cachedStorage) cachedStorage = getStorage(getFirebaseApp())
	return cachedStorage
}