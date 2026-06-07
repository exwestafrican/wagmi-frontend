import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { fullName } from "@/features/directory/utils/teammate.ts"

export default function LegacyTextPart({
	author,
	content,
}: { author: Teammate; content: { msg: string; timestamp: number }[] }) {
	return (
		<div className="flex flex-row gap-4 items-start">
			<FallbackAvatar teammate={author} size="sm" />
			<div className="flex flex-col gap-0">
				<div className="flex flex-row gap-1 items-center">
					<h1 className="font-semibold text-sm">{fullName(author)}</h1>
					<span className="text-xs font-normal text-gray-400">
						{" "}
						Today at 9:15pm{" "}
					</span>
				</div>
				{content.map(({ msg, timestamp }) => (
					<p key={timestamp} className="text-sm font-normal">
						{msg}
					</p>
				))}
			</div>
		</div>
	)
}
