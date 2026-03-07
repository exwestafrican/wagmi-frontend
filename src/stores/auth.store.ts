import { create } from "zustand"
import {persist} from "zustand/middleware";

interface AuthStore {
	token: string | null
	setAuthToken: (token: string) => void
	clearAuthToken: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            token: null,
            setAuthToken: (token) => set({ token }),
            clearAuthToken: () => set({ token: null }),
        }),
        {
            name: "auth-storage", // key in localStorage
        }
    )
)