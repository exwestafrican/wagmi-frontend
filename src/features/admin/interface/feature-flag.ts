export const FeatureFlagStatus = {
	GLOBAL: "global",
	PARTIAL: "partial",
	DISABLED: "disabled",
} as const

export interface FeatureFlag {
	key: string
	name: string
	description: string
	status: (typeof FeatureFlagStatus)[keyof typeof FeatureFlagStatus]
}
