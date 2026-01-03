import sentenceCase from "@/utils/sentence-case"
import { FeatureIcon } from "./feature-icon"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"
import { ChevronUp } from "lucide-react"
import { EmailRequestModal } from "@/features/waitlist/components/email-request-modal"
import { useState } from "react"
import { useWaitlistStore } from "@/features/waitlist/store/useWaitlistStatus"
import { useToggleVotes } from "@/features/waitlist/api/toggle-votes"

export function UpcomingFeature({ feature }: { feature: RoadmapFeature }) {
	const [openEmailRequestModal, onOpenEmailRequestModalChange] = useState(false)
	const email = useWaitlistStore((state) => state.email)
	const [votedForFeature, setVotedForFeature] = useState(false)
	const { mutate: voteOnFeature } = useToggleVotes()


	function sendVote(email: string, feature: RoadmapFeature){
		if(votedForFeature){
			feature.voteCount--
			setVotedForFeature(false)
		} else {
			feature.voteCount++
			setVotedForFeature(true)
		}
		voteOnFeature({ email, featureId: feature.id })
	}

	function requestUserEmail() {
		onOpenEmailRequestModalChange(true) //open email request modal
	}

	return (
		<>
			<EmailRequestModal
				open={openEmailRequestModal}
				onOpenChange={onOpenEmailRequestModalChange}
				onSubmitEmailRequest={async (email: string) => {
					onOpenEmailRequestModalChange(false) //close email request modal
					sendVote(email, feature)
				}}
			/>
			<div
				data-testid={`upcoming-feature-${feature.id}`}
				className="flex items-center gap-3 border cursor-pointer rounded-lg p-4 hover:border-foreground/20 hover:bg-foreground/5 transition-colors duration-200 ease-out"
			>
				<FeatureIcon
					className="w-5 h-5 text-foreground/60"
					icon={feature.icon}
				/>
				<h3 className="flex-1 text-foreground/60 truncate">
					{sentenceCase(feature.name)}
				</h3>
				<button
					onClick={() => {
						if (email) {
							console.log("vote for reature")
							sendVote(email, feature)
						} else {
							requestUserEmail()
						}
					}}
					type="button"
					className="cursor-pointer p-1.5 py-0.5 rounded-md text-xs transition-all text-foreground/40 hover:bg-foreground/5"
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
