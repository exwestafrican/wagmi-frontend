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
	return (
		<div className="flex flex-col gap-3">
			{messages.map((message) => (
				<TextPart
					key={message.nodes.map((n) => n.id).join("-")}
					author={registry.find(message.authorId) ?? buildUnknownTeammate()}
					nodes={message.nodes}
					state={message.state}
				/>
			))}
		</div>
	)
}
