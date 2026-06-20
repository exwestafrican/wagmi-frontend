import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import { Badge } from "@/components/ui/badge.tsx"

export function ConversationIntro({
	teammate,
	isWithSelf,
}: { teammate: Teammate; isWithSelf: boolean }) {
	return (
		<div className="flex flex-col gap-2">
			<FallbackAvatar size={"m"} variant={"stone"} teammate={teammate} />
			<div className="flex flex-col gap-0 justify-start ">
				<h1 className="text-sm font-semibold">{fullName(teammate)}</h1>
				<span aria-label="intro-username" className="text-xs text-muted-brown">@{teammate.username}</span>
			</div>

			<div>
				{isWithSelf ? (
					<p className="text-sm leading-relaxed">
						{" "}
						<span className="font-medium">This is your space</span>. Draft
						messages, list your to-dos, or keep links and files handy. You can
						also talk to yourself here, we won't think you're crazy!
					</p>
				) : (
					<p className="text-sm leading-relaxed flex flex-wrap gap-1">
						<span>This conversation is just between</span>
						<Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 text-xs font-medium px-1 shrink-0 max-w-48 truncate rounded-xs">
							@{teammate.username}
						</Badge>
						<span> and you. </span>
					</p>
				)}
			</div>
		</div>
	)
}
