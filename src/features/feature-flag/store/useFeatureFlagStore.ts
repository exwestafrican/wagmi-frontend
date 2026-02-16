import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FeatureFlagKey } from "../types"

const FEATURE_FLAG_KEY = "feature-flag-store"

export interface FeatureFlagStore {
	enabledFeatures: string[]
	setFeatures: (features: string[]) => void
	isEnabled: (key: FeatureFlagKey) => boolean
}

export const useFeatureFlagStore = create<FeatureFlagStore>()(
	persist(
		(set, get) => ({
			enabledFeatures: [],
			setFeatures: (features) => set({ enabledFeatures: features }),
			isEnabled: (key) => get().enabledFeatures.includes(key),
		}),
		{
			name: FEATURE_FLAG_KEY,
		},
	),
)
