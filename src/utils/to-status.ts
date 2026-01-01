import { RoadmapFeatureStage } from "@/features/waitlist/enums/roadmap-feautre-stage"

export function toStatus(stage: RoadmapFeatureStage) {
	switch (stage) {
		case RoadmapFeatureStage.IN_PROGRESS:
			return "In progress"
		case RoadmapFeatureStage.PLANNED:
			return "Planned"
		default:
			throw new Error(`Invalid stage ${stage}`)
	}
}

export function getStatusColor(stage: RoadmapFeatureStage) {
	switch (stage) {
		case RoadmapFeatureStage.IN_PROGRESS:
			return "bg-orange-500"
		case RoadmapFeatureStage.PLANNED:
			return "bg-green-500"
		default:
			throw new Error(`Invalid stage ${stage}`)
	}
}
