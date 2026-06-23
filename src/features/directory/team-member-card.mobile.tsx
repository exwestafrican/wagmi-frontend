import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import {
	buildTeammateRole,
	fullName,
} from "@/features/directory/utils/teammate.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

export default function TeamMemberCardMobile({
	teammate,
}: { teammate: Teammate }) {
	const role = buildTeammateRole(teammate)

	return (
		<div className="flex items-start gap-2 cursor-pointer">
			<div className="relative shrink-0">
				<FallbackAvatar size="m" variant="stone" teammate={teammate} />
			</div>
			<div className="flex flex-col gap-0 min-w-0">
				<span className="text-sm font-semibold">{fullName(teammate)}</span>
				<span className="text-xs text-muted-brown truncate">
					@{teammate.username} · {role.name}
				</span>
			</div>
		</div>
	)
}
