import { getStatusColor, toStatus } from "@/utils/to-status"
import type { RoadmapFeatureStage } from "../enums/roadmap-feautre-stage"

export function Status({ stage }: { stage: RoadmapFeatureStage }) {
	return (
		<div className="flex items-center gap-2">
			<div className={`${getStatusColor(stage)} w-2 h-2 rounded-full`} />
			<span className="text-sm text-foreground">{toStatus(stage)}</span>
		</div>
	)
}
