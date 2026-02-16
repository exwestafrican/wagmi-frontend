import { useFeatureFlagStore } from "../store/useFeatureFlagStore"
import type { FeatureFlagKey } from "../types"

export function useFeatureFlag(key: FeatureFlagKey) {
	return useFeatureFlagStore((state) => state.isEnabled(key))
}
