import { create } from "zustand"
import { persist } from "zustand/middleware"

const WAITLIST_STATUS_KEY = "waitlist-store"

export interface WaitlistStore {
	hasJoined: boolean
	email: string
	join: (email: string) => void
}

export const useWaitlistStore = create<WaitlistStore>()(
	persist(
		(set) => ({
			hasJoined: false,
			email: "",
			join: (email: string) => set({ hasJoined: true, email }),
		}),
		{
			name: WAITLIST_STATUS_KEY,
		},
	),
)
