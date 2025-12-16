import { useState } from "react"
import type { Message } from "@/features/chat/types/message"
import { MessageDirection } from "@/features/chat/types/message"
import { Input } from "@/components/ui/input"

export default function ChatPage() {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && messageContent.trim() !== "") {
			const newMessage: Message = {
				id: messages.length + 1,
				content: messageContent.trim(),
				direction: MessageDirection.OUTBOUND,
				createdAt: new Date(),
			}

			setMessages((prev) => [...prev, newMessage])
			setMessageContent("")
		}
	}
	const [messageContent, setMessageContent] = useState("")

	const [messages, setMessages] = useState<Message[]>([
		{
			id: 1,
			content: "Hello, how are you?",
			direction: MessageDirection.INBOUND,
			createdAt: new Date(),
		},
		{
			id: 2,
			content: "I'm fine, thank you!",
			direction: MessageDirection.OUTBOUND,
			createdAt: new Date(),
		},
	])

	function InboundMessage({ message }: { message: Message }) {
		return (
			<div className="self-start cursor-pointer" key={message.id}>
				{message.content}
			</div>
		)
	}

	function OutboundMessage({ message }: { message: Message }) {
		return (
			<div className="self-end cursor-pointer" key={message.id}>
				{message.content}
			</div>
		)
	}

	return (
		<div className="flex flex-col w-3/6 mx-auto h-screen p-8">
			<div className="flex flex-col gap-2 justify-start items-center flex-1 overflow-y-auto">
				{messages.map((message) => {
					if (message.direction === MessageDirection.INBOUND) {
						return <InboundMessage key={message.id} message={message} />
					}
					return <OutboundMessage key={message.id} message={message} />
				})}
			</div>

			<Input
				value={messageContent}
				onChange={(e) => setMessageContent(e.target.value)}
				type="text"
				placeholder="Message"
				onKeyDown={handleKeyDown}
			/>
		</div>
	)
}
