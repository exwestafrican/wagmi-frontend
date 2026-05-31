export const FeatureFlagStatus = {
	GLOBAL: "GLOBAL",
	PARTIAL: "PARTIAL",
	DISABLED: "DISABLED",
} as const

export interface FeatureFlag {
	key: string
	name: string
	description: string
	status: (typeof FeatureFlagStatus)[keyof typeof FeatureFlagStatus]
}
