import type { MessageContent } from "@envoye/features/conversation/interface/text-node.ts"
import TextPart from "@envoye/features/conversation/components/text-part.tsx"
import { DateDivider } from "@envoye/features/conversation/components/date-divider.tsx"
import { groupMessagesByDay } from "@envoye/features/conversation/utils/message-date.ts"
import useTeammateInfoRegistry from "@envoye/features/directory/hooks/use-teammate-Info-registry.ts"
import { buildUnknownTeammate } from "@envoye/features/directory/utils/teammate.ts"
import { Fragment } from "react"

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
	const groups = groupMessagesByDay(messages)

	return (
		<div className="flex flex-col gap-0">
			{groups.map(({ dayKey, label, messages: dayMessages }) => (
				<Fragment key={dayKey}>
					<DateDivider label={label} />
					<div className="flex flex-col gap-3">
						{dayMessages.map((message) => (
							<TextPart
								key={`${conversationId}${message.createdAt}`}
								author={
									registry.find(message.authorId) ?? buildUnknownTeammate()
								}
								message={message}
								workspaceCode={workspaceCode}
								conversationId={conversationId}
							/>
						))}
					</div>
				</Fragment>
			))}
		</div>
	)
}
