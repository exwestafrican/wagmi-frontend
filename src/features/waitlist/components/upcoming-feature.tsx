import sentenceCase from "@/utils/sentence-case"
import { FeatureIcon } from "./feature-icon"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"

export function UpcomingFeature({ feature }: { feature: RoadmapFeature }) {
	return (
		<div
			data-testid={`upcoming-feature-${feature.id}`}
			className="flex items-center gap-3 border cursor-pointer rounded-lg p-4 hover:border-foreground/20 hover:bg-foreground/5 transition-colors duration-200 ease-out"
		>
			<FeatureIcon className="w-5 h-5 text-foreground/60" icon={feature.icon} />
			<h3 className="flex-1 text-foreground/60 truncate">
				{sentenceCase(feature.name)}
			</h3>
		</div>
	)
}

export function UpcomingFeatureSkeleton() {
	return (
		<div className="flex items-center gap-3 border rounded-lg p-4 animate-pulse">
			<div className="w-5 h-5 rounded bg-muted" />
			<div className="flex-1 space-y-2">
				<div className="h-4 w-5/6 rounded bg-muted" />
			</div>
		</div>
	)
}
