import { Toaster } from "@/components/ui/sonner"
import JoinWaitListForm from "@/features/waitlist/components/join-form"
import CountdownClock from "@/features/waitlist/components/countdown-clock.tsx"
import { useWaitlistStore } from "@/features/waitlist/store/useWaitlistStatus"
import { useGetRoadmapFeatures } from "@/features/waitlist/api/useRoadmapFeatures"
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
import { Button } from "@/components/ui/button"

function plannedFeatures(features: RoadmapFeature[]) {
	return features.filter(
		(feature: RoadmapFeature) => feature.stage === RoadmapFeatureStage.PLANNED,
	)
}

function upcomingProgress(features: RoadmapFeature[]) {
	return features.filter(
		(feature: RoadmapFeature) =>
			feature.stage === RoadmapFeatureStage.IN_PROGRESS,
	)
}
function WaitListPage() {
	const hasJoined = useWaitlistStore((state) => state.hasJoined)
	const emptyUpcomingFeatures = new Array(3)
		.fill(0)
		.map((_, idx) => ({ id: idx }))
	const { data: response, isLoading } = useGetRoadmapFeatures()

	return (
		<div>
			<nav className="w-full py-6 px-6 relative z-10">
				<div className="max-w-6xl mx-auto flex items-center justify-end">
					<Button
						variant="outline"
						data-testid="contact-us-button"
						className="rounded-lg border-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
						onClick={() => {
							// Construct email to avoid SEO indexing
							const subject = encodeURIComponent("Contact from Website")
							const body = encodeURIComponent("Hello,")
							window.location.href = `mailto:${"hello.envoye@gmail.com"}?subject=${subject}&body=${body}`
						}}
					>
						Contact Us
					</Button>
				</div>
			</nav>

			<div
				className="min-h-screen px-8 flex items-center"
				style={{
					background:
						"radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 120, 120, 0.15), transparent 50%), #ffffff",
				}}
			>
				<Toaster richColors test-id="toaster" position="top-right" />

				<main className="mx-auto max-w-6xl  w-full flex flex-col lg:flex-row gap-10">
					<div className="flex-1 gap-8  flex flex-col justify-center">
						<div>
							<h2 className="text-4xl tracking-tight">
								Creating a remarkable customer experience
							</h2>
							<p className="text-foreground/60 tracking-tight">
								{" "}
								Unify all your customer communications in one powerful inbox.{" "}
							</p>
						</div>
						{hasJoined ? (
							<div>
								<p className=" text-sm  text-foreground/40 tracking-tight mb-2">
									Launching in
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
								<h2 className="tracking-wide text-sm"> work in progress</h2>
							</div>
							{isLoading ? (
								<PlannedFeatureSkeleton />
							) : (
								plannedFeatures(response?.data ?? [])
									.sort((a, b) => b.votes - a.votes)
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
							<div className="flex items-center gap-2">
								<h2 className="tracking-wide text-sm"> upcoming features</h2>
							</div>
							{isLoading
								? emptyUpcomingFeatures.map((emptyFeature) => (
										<UpcomingFeatureSkeleton key={emptyFeature.id} />
									))
								: upcomingProgress(response?.data ?? [])
										.sort((a, b) => b.votes - a.votes)
										.map((feature) => (
											<UpcomingFeature key={feature.id} feature={feature} />
										))}
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}

export default WaitListPage
