import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import FallbackAvatar from "@/features/directory/component/fallback-avatar.tsx"
import { fullName } from "@/features/directory/utils/teammate.ts"
import {
	type MessageContent,
	MessageState,
} from "@/features/conversation/interface/text-node.ts"
import toJSX from "@/features/conversation/utils/to-jsx.tsx"
import { Fragment } from "react"
import { cn } from "@/lib/utils.ts"
import { AlertCircle, RotateCcw } from "lucide-react"
import { useSendReply } from "@/features/conversation/api/send-reply.ts"
import { updateChatHistoryStateInStore } from "@/features/conversation/api/chat-history.ts"
import { useQueryClient } from "@tanstack/react-query"

export default function TextPart({
	author,
	message,
	workspaceCode,
	conversationId,
}: {
	author: Teammate
	message: MessageContent
	workspaceCode: string
	conversationId: number
}) {
	const { mutate: reply } = useSendReply()

	const queryClient = useQueryClient()

	const state = message.state
	const nodes = message.nodes

	const isSending = state === MessageState.SENDING

	const isFailed = state === MessageState.FAILED

	async function retry() {
		await updateChatHistoryStateInStore(
			queryClient,
			workspaceCode,
			conversationId,
			message.id,
			MessageState.SENDING,
		)
		reply(
			{ workspaceCode, conversationId, message, sentAt: message.createdAt },
			{
				onSuccess: async () => {
					await updateChatHistoryStateInStore(
						queryClient,
						workspaceCode,
						conversationId,
						message.id,
						MessageState.SENT,
					)
				},

				onError: async () => {
					await updateChatHistoryStateInStore(
						queryClient,
						workspaceCode,
						conversationId,
						message.id,
						MessageState.FAILED,
					)
				},
			},
		)
	}

	return (
		<div
			className={cn(
				"flex flex-row gap-4 items-start transition-opacity",
				isSending ? "opacity-50 delay-300" : "opacity-100",
			)}
		>
			<FallbackAvatar teammate={author} size="sm" />
			<div className="flex flex-col gap-0.5">
				<div className="flex flex-row gap-1 items-center">
					<h1 className="font-semibold text-sm">{fullName(author)}</h1>
					<span className="text-xs font-normal text-gray-400">
						{" "}
						Today at 9:15pm{" "}
					</span>
				</div>

				<div className="flex flex-col gap-2 instrument-sans-font">
					{nodes.map((node) => (
						<Fragment key={node.id}>{toJSX(node)}</Fragment>
					))}
					{isFailed && (
						<div className="flex flex-row gap-1 items-center text-xs">
							<AlertCircle className="w-2.5 h-2.5 shrink-0 text-red-700" />
							<p className="text-red-700"> Failed to send message</p>
							<span className="text-xs">·</span>
							<button
								type={"button"}
								onClick={() => retry()}
								className="cursor-pointer items-center flex gap-0.5 hover:opacity-70 transition-opacity"
							>
								<RotateCcw className="w-2.5 h-2.5" />
								Retry
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
