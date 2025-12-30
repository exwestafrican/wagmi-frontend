import { FeatureIcon } from "@/features/waitlist/components/feature-icon"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"

export function PlannedFeature({ feature }: { feature: RoadmapFeature }) {
	return (
		<div
			data-testid={`planned-feature-${feature.id}`}
			className="flex items-center gap-3 border cursor-pointer rounded-lg p-4 hover:border-foreground/20 hover:bg-foreground/5 transition-colors duration-200 ease-out"
		>
			<FeatureIcon className="w-5 h-5 text-foreground/60" icon={feature.icon} />
			<h3 className="flex-1">{feature.name}</h3>
			<div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
		</div>
	)
}

export function PlannedFeatureSkeleton() {
	return (
		<div className="flex items-center gap-3 border cursor-pointer rounded-lg p-4 animate-pulse">
			<div className="w-4 h-4 bg-muted rounded" />
			<div className="flex-1 w-4 h-4 bg-muted rounded" />
			<div className="w-2 h-2 rounded-full bg-amber-500" />
		</div>
	)
}
