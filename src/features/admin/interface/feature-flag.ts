export interface FeatureFlag {
	key: string
	name: string
	description: string
	status: "global" | "partial" | "disabled"
}
