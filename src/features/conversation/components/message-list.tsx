import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import TextPart from "@/features/conversation/components/text-part.tsx"

export function MessageList({ messages }: { messages: MessageContent[] }) {
	return (
		<div className="flex flex-col gap-3">
			{messages.map((content) => (
				<TextPart
					key={content.nodes.map((n) => n.id).join("-")}
					author={content.author}
					nodes={content.nodes}
				/>
			))}
		</div>
	)
}
