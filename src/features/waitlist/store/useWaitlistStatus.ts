import { create } from "zustand"
import { persist } from "zustand/middleware"

const WAITLIST_STATUS_KEY = "waitlist-store"

interface WaitlistStore {
	hasJoined: boolean
	join: () => void
}

export const useWaitlistStore = create<WaitlistStore>()(
	persist(
		(set) => ({
			hasJoined: false,
			join: () => set({ hasJoined: true }),
		}),
		{
			name: WAITLIST_STATUS_KEY,
		},
	),
)
