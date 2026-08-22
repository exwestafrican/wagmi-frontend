import type { RoadmapFeatureStage } from "@envoye/features/waitlist/enums/roadmap-feautre-stage"

export interface RoadmapFeature {
	id: string
	name: string
	voteCount: number
	icon: string
	stage: RoadmapFeatureStage
}
