import type { RoadmapFeatureStage } from "@/features/waitlist/enums/roadmap-feautre-stage"

export interface RoadmapFeature {
	id: string
	name: string
	description: string
	voteCount: number
	icon: string
	stage: RoadmapFeatureStage
	updatedAt: string
}
