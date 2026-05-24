import { z } from "zod"

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

export const featureFormSchema = z.object({
	name: z.string().trim(),
	key: z.string().trim(),
	description: z.string().trim(),
	status: z.enum([
		FeatureFlagStatus.GLOBAL,
		FeatureFlagStatus.PARTIAL,
		FeatureFlagStatus.DISABLED,
	]),
})
