import type { RoadmapFeatureStage } from "@/features/waitlist/enums/roadmap-feautre-stage"

export interface RoadmapFeature {
	id: string
	name: string
	votes: number
	icon: string
	stage: RoadmapFeatureStage
}
