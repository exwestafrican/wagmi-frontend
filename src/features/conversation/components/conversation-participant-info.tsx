import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { cn } from "@/lib/utils.ts"
import { Fragment } from "react"
import { SingleParticipantInfo } from "@/features/conversation/components/single-participant-info.tsx"

function ParticipantBadge({
	participant,
	className,
}: { participant: Teammate; className?: string }) {
	return (
		<Badge
			aria-label={`badge-${participant.id}`}
			className={cn(
				"bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 text-xs font-medium px-1 shrink-0 max-w-48 truncate rounded-xs",
				className,
			)}
		>
			@{participant.username}
		</Badge>
	)
}

export function ConversationParticipantInfo({
	participants,
	authorId,
}: { participants: Teammate[]; authorId: number }) {
	const lastParticipantIdx = participants.length - 1
	const isSingleParticipant = participants.length === 1

	if (isSingleParticipant) {
		return (
			<SingleParticipantInfo
				participant={participants[0]}
				isWithSelf={participants[0].id === authorId}
			/>
		)
	}

	return (
		<div className="flex flex-wrap flex-col gap-4">
			<div className="flex flex-row gap-2">
				{participants.map((participant) => (
					<FallbackAvatar
						key={participant.id}
						size={"m"}
						variant={"stone"}
						teammate={participant}
					/>
				))}
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-sm leading-relaxed flex flex-row gap-1">
					<Fragment>
						{" "}
						This is the very beginning of your direct message history with{" "}
					</Fragment>
					<span className="flex flex-row gap-2">
						{participants.slice(0, lastParticipantIdx).map((participant) => (
							<ParticipantBadge
								key={participant.id}
								participant={participant}
							/>
						))}
					</span>

					{participants.length > 1 && (
						<span>
							{" "}
							and{" "}
							<ParticipantBadge
								participant={participants[lastParticipantIdx]}
							/>{" "}
						</span>
					)}
				</p>
				<p className="text-sm leading-relaxed">
					{" "}
					You’ll be notified for <b>every new message</b> in this conversation.{" "}
				</p>
			</div>
		</div>
	)
}
