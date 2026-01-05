import sentenceCase from "@/utils/sentence-case"
import { FeatureIcon } from "./feature-icon"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"
import { EmailRequestModal } from "@/features/waitlist/components/email-request-modal"
import { ChevronUp } from "lucide-react"
import { useState } from "react"
import { useToggleVotes } from "@/features/waitlist/api/toggle-votes"
import { useWaitlistStore } from "@/features/waitlist/store/useWaitlistStatus"
import { useUserVotes } from "@/features/waitlist/api/user-votes"

export function UpcomingFeature({
	feature,
	onClick,
}: { feature: RoadmapFeature; onClick: (feature: RoadmapFeature) => void }) {
	const [openEmailRequestModal, openEmailRequestModalChange] = useState(false)
	const email = useWaitlistStore((state) => state.email)
	const { mutate: sendVote } = useToggleVotes()

	// Get user's voted features
	const { data: userVotesResponse } = useUserVotes(email)
	const userVotedFeatureIds = userVotesResponse?.data?.featureIds || []
	const hasUserVoted = userVotedFeatureIds.includes(feature.id)

	return (
		<>
			<EmailRequestModal
				open={openEmailRequestModal}
				onOpenChange={openEmailRequestModalChange}
				onSubmitEmailRequest={async (email: string) => {
					openEmailRequestModalChange(false) //close email request modal
					await sendVote({ email: email, featureId: feature.id })
				}}
			/>
			<div
				data-testid={`upcoming-feature-${feature.id}`}
				className="w-full text-left flex items-center gap-3 border cursor-pointer rounded-lg p-4 hover:border-foreground/20 hover:bg-foreground/5 transition-colors duration-200 ease-out"
				onClick={() => onClick(feature)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onClick(feature)
					}
				}}
			>
				<FeatureIcon
					className="w-5 h-5 text-foreground/60"
					icon={feature.icon}
				/>
				<h3 className="flex-1 text-foreground/60 truncate">
					{sentenceCase(feature.name)}
				</h3>
				<button
					data-testid={`vote-button-${feature.id}`}
					onClick={async (e) => {
						e.stopPropagation()
						if (email) {
							await sendVote({ email: email, featureId: feature.id })
						} else {
							openEmailRequestModalChange(true)
						}
					}}
					type="button"
					className={`disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer p-1.5 py-0.5 rounded-md text-xs transition-all  hover:bg-foreground/5 ${
						hasUserVoted ? "text-foreground" : "text-foreground/40"
					}`}
				>
					<ChevronUp className="w-2.5 h-2.5" />
					{feature.voteCount}
				</button>
			</div>
		</>
	)
}

export function UpcomingFeatureSkeleton() {
	return (
		<div className="flex items-center gap-3 border rounded-lg p-4 animate-pulse cursor-pointer">
			<div className="w-5 h-5 rounded bg-muted" />
			<div className="flex-1 space-y-2">
				<div className="h-4 w-5/6 rounded bg-muted" />
			</div>
		</div>
	)
}
