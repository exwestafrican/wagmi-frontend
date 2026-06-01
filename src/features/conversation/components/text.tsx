import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { fullName } from "@/features/directory/utils/teammate.ts"

export default function TextPart({
	author,
	content,
}: { author: Teammate; content: string[] }) {
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
				{content.map((msg) => (
					<p className="text-sm font-normal">{msg}</p>
				))}
			</div>
		</div>
	)
}
