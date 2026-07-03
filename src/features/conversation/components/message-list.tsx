import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import TextPart from "@/features/conversation/components/text-part.tsx"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"
import { buildUnknownTeammate } from "@/features/directory/utils/teammate.ts"

export function MessageList({
	workspaceCode,
	messages,
	conversationId,
}: {
	workspaceCode: string
	messages: MessageContent[]
	conversationId: number
}) {
	const registry = useTeammateInfoRegistry(workspaceCode)
	return (
		<div className="flex flex-col gap-3">
			{messages.map((message) => (
				<TextPart
					key={`${conversationId}${message.createdAt}`}
					author={registry.find(message.authorId) ?? buildUnknownTeammate()}
					message={message}
					workspaceCode={workspaceCode}
					conversationId={conversationId}
				/>
			))}
		</div>
	)
}
