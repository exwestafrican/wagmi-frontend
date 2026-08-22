import { faker } from "@faker-js/faker"
import { Factory } from "fishery"
import {
	makeTextNode,
	type MessageContent,
	MessageState,
} from "@envoye/features/conversation/interface/text-node.ts"

export const messageContentFactory = Factory.define<MessageContent>(
	({ sequence }) => {
		const authorId = 7
		const createdAt = sequence * 1_000

		return {
			id: createdAt + authorId,
			authorId,
			nodes: [makeTextNode(faker.lorem.sentence())],
			state: MessageState.SENT,
			createdAt,
		}
	},
)

export const sendingMessageContentFactory = messageContentFactory.params({
	state: MessageState.SENDING,
})

export const failedMessageContentFactory = messageContentFactory.params({
	state: MessageState.FAILED,
})
