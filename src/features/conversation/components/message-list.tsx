import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import TextPart from "@/features/conversation/components/text-part.tsx"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import { buildUnknownTeammate } from "@/features/directory/utils/teammate.ts"

export function MessageList({
	workspaceCode,
	messages,
}: {
	workspaceCode: string
	messages: MessageContent[]
}) {
	const registry = useTeammateInfoRegistry(workspaceCode)
	//TODO add loading state
	return (
		<div className="flex flex-col gap-3">
			{messages.map((content) => (
				<TextPart
					key={content.id}
					author={registry.find(content.authorId) ?? buildUnknownTeammate()}
					nodes={content.nodes}
				/>
			))}
		</div>
	)
}
