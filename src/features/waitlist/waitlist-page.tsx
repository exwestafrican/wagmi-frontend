import { Toaster } from "@/components/ui/sonner"
import JoinWaitListForm from "@/features/waitlist/components/join-form"
import CountdownClock from "@/features/waitlist/components/countdown-clock.tsx"
import { useWaitlistStore } from "@/features/waitlist/store/useWaitlistStatus"
import { useGetRoadmapFeatures } from "@/features/waitlist/api/roadmap-features"
import {
	UpcomingFeature,
	UpcomingFeatureSkeleton,
} from "@/features/waitlist/components/upcoming-feature"
import {
	PlannedFeature,
	PlannedFeatureSkeleton,
} from "@/features/waitlist/components/planned-feature.tsx"
import { Loader } from "lucide-react"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"
import { RoadmapFeatureStage } from "@/features/waitlist/enums/roadmap-feautre-stage"
import { useState } from "react"
import { FeatureRequestModal } from "@/features/waitlist/components/feature-request-modal"
import { useTranslation } from "react-i18next"

function filterFeaturesByStage(
	features: RoadmapFeature[],
	stage: RoadmapFeatureStage,
) {
	return features.filter((feature: RoadmapFeature) => feature.stage === stage)
}

function WaitListPage() {
	const { t, i18n } = useTranslation("waitlist")
	const hasJoined = useWaitlistStore((state) => state.hasJoined)
	const emptyUpcomingFeatures = new Array(3)
		.fill(0)
		.map((_, idx) => ({ id: idx }))
	const { data: response, isLoading } = useGetRoadmapFeatures()
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	return (
		<div
			className="min-h-screen px-8 flex items-center"
			style={{
				background:
					"radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 120, 120, 0.15), transparent 50%), #ffffff",
			}}
		>
			<div className="fixed top-4 right-4 z-50 flex gap-2">
				<button
					type="button"
					onClick={() => i18n.changeLanguage("en")}
					className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						i18n.language === "en"
							? "bg-black text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow cursor-pointer"
					}`}
				>
					EN
				</button>
				<button
					type="button"
					onClick={() => i18n.changeLanguage("fr")}
					className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						i18n.language === "fr"
							? "bg-black text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow cursor-pointer"
					}`}
				>
					FR
				</button>
			</div>

			<Toaster richColors test-id="toaster" position="top-right" />
			<main className="mx-auto max-w-6xl  w-full flex flex-col lg:flex-row gap-10">
				<div className="flex-1 gap-8  flex flex-col justify-center">
					<div>
						<h2 className="text-4xl tracking-tight">{t("heading")}</h2>
						<p className="text-foreground/60 tracking-tight">
							{t("subheading")}{" "}
						</p>
					</div>
					{hasJoined ? (
						<div>
							<p className=" text-sm  text-foreground/40 tracking-tight mb-2">
								{t("launchingIn")}
							</p>
							<CountdownClock />
						</div>
					) : (
						<JoinWaitListForm />
					)}
				</div>
				<div className="flex-1 order-2 space-y-12   lg:order-2">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Loader className="size-4 animate-spin" />
							<h2 className="tracking-wide text-sm"> {t("workInProgress")}</h2>
						</div>
						{isLoading ? (
							<PlannedFeatureSkeleton />
						) : (
							filterFeaturesByStage(
								response?.data ?? [],
								RoadmapFeatureStage.PLANNED,
							)
								.sort((a, b) => b.voteCount - a.voteCount)
								.map((feature) => (
									<PlannedFeature
										data-testid={`planned-feature-${feature.id}`}
										key={feature.id}
										feature={feature}
									/>
								))
						)}
					</div>

					<div className="space-y-2">
						<div className="flex justify-between items-center gap-2">
							<h2 className="tracking-wide text-sm">
								{" "}
								{t("upcomingFeatures")}
							</h2>
							<FeatureRequestModal
								open={isDialogOpen}
								onOpenChange={setIsDialogOpen}
							/>
						</div>
						{isLoading
							? emptyUpcomingFeatures.map((emptyFeature) => (
									<UpcomingFeatureSkeleton key={emptyFeature.id} />
								))
							: filterFeaturesByStage(
									response?.data ?? [],
									RoadmapFeatureStage.IN_PROGRESS,
								)
									.sort((a, b) => b.voteCount - a.voteCount)
									.map((feature) => (
										<UpcomingFeature key={feature.id} feature={feature} />
									))}
					</div>
				</div>
			</main>
		</div>
	)
}

export default WaitListPage
