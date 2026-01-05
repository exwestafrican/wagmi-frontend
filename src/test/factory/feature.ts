// src/test/factories/roadmap-feature.factory.ts
import { Factory } from "fishery"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"
import { RoadmapFeatureStage } from "@/features/waitlist/enums/roadmap-feautre-stage"

export const roadmapFeatureFactory = Factory.define<RoadmapFeature>(
	({ sequence }) => ({
		id: crypto.randomUUID(),
		name: `Feature ${sequence}`,
		description: `A description of the ${sequence}`,
		voteCount: sequence * 10,
		icon: "mail",
		stage: RoadmapFeatureStage.IN_PROGRESS,
		updatedAt: new Date().toISOString(),
	}),
)

export const plannedFeatureFactory = roadmapFeatureFactory.params({
	stage: RoadmapFeatureStage.PLANNED,
})

export const inProgressFeatureFactory = roadmapFeatureFactory.params({
	stage: RoadmapFeatureStage.IN_PROGRESS,
})
