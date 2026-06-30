import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import type { TextNode } from "@/features/conversation/interface/text-node.ts"
import toJSX from "@/features/conversation/utils/to-jsx.tsx"
import { Fragment } from "react"

export default function TextPart({
	author,
	nodes,
}: { author: Teammate; nodes: TextNode[] }) {
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

				<div className="flex flex-col gap-2">
					{nodes.map((node) => (
						<Fragment key={node.id}>{toJSX(node)}</Fragment>
					))}
				</div>
			</div>
		</div>
	)
}
