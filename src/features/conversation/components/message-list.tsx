import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import TextPart from "@/features/conversation/components/text-part.tsx"
import useTeammateInfoRegistry from "@/features/directory/hooks/use-teammate-Info-registry.ts"

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
					key={content.nodes.map((n) => n.id).join("-")}
					author={registry.find(content.authorId)!}
					nodes={content.nodes}
				/>
			))}
		</div>
	)
}
