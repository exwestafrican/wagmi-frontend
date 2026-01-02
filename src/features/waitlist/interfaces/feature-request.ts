import type { FeatureRequestPriority } from "@/features/waitlist/enums/feature-request-priority"

export interface FeatureRequest {
	description: string
	email: string
	priority: FeatureRequestPriority
}
