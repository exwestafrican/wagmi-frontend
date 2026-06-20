import { useCallback, useLayoutEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import type { MessageContent } from "@/features/conversation/interface/text-node.ts"
import TextPart from "@/features/conversation/components/text-part.tsx"

export function MessageList({ messages }: { messages: MessageContent[] }) {
	const messageScrollRef = useRef<HTMLDivElement | null>(null)

	const scrollToLatestMessage = useCallback(() => {
		const viewport = messageScrollRef.current?.querySelector(
			'[data-slot="scroll-area-viewport"]',
		) as HTMLElement | null
		if (viewport) {
			viewport.scrollTop = viewport.scrollHeight
		}
	}, [])

	useLayoutEffect(() => {
		if (messages.length > 0) {
			scrollToLatestMessage()
		}
	}, [messages, scrollToLatestMessage])

	return (
		<div ref={messageScrollRef} className="flex-1 min-h-0">
			<ScrollArea className="h-full">
				<div className="px-4 py-3 flex flex-col gap-3">
					{messages.map((content) => (
						<TextPart
							key={content.nodes.map((n) => n.id).join("-")}
							author={content.author}
							nodes={content.nodes}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	)
}
