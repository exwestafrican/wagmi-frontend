import type { FeatureRequestPriority } from "@envoye/features/waitlist/enums/feature-request-priority"

export interface FeatureRequest {
	description: string
	email: string
	priority: FeatureRequestPriority
}
