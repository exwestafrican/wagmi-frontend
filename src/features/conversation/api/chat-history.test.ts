import { describe, expect, test } from "vitest"
import {
	getLastMessageSentAt,
	mergeChatHistory,
} from "@/features/conversation/api/chat-history.ts"
import {
	makeTextNode,
	MessageState,
} from "@/features/conversation/interface/text-node.ts"
import {
	failedMessageContentFactory,
	messageContentFactory,
	sendingMessageContentFactory,
} from "@/test/factory/message-content.ts"

describe("getLastMessageSentAt", () => {
	test("returns createdAt of the last message", () => {
		const messages = [
			messageContentFactory.build({ id: 1001, createdAt: 1_000 }),
			messageContentFactory.build({ id: 2002, createdAt: 2_000 }),
		]

		expect(getLastMessageSentAt(messages)).toBe(2_000)
	})

	test("returns undefined for an empty list", () => {
		expect(getLastMessageSentAt([])).toBeUndefined()
	})
})

describe("mergeChatHistory", () => {
	test("appends genuinely new messages", () => {
		const existing = [
			messageContentFactory.build({ id: 1007, createdAt: 1_000 }),
		]
		const raymondReply = messageContentFactory.build({
			id: 2001,
			authorId: 1,
			createdAt: 2_000,
			nodes: [makeTextNode("On my way")],
		})

		const merged = mergeChatHistory(existing, [raymondReply])

		expect(merged).toHaveLength(2)
		expect(merged[1]).toEqual(raymondReply)
	})

	test("does not duplicate when the same id already exists", () => {
		const cached = sendingMessageContentFactory.build({
			id: 1007,
			createdAt: 1_000,
			nodes: [makeTextNode("optimistic draft")],
		})
		const serverCopy = messageContentFactory.build({
			id: 1007,
			createdAt: 1_000,
			nodes: [makeTextNode("confirmed on server")],
		})

		const merged = mergeChatHistory([cached], [serverCopy])

		expect(merged).toHaveLength(1)
		expect(merged[0]).toEqual(serverCopy)
	})

	test("upgrades SENDING to SENT when poll returns the server copy", () => {
		const optimisticSend = sendingMessageContentFactory.build({
			id: 3007,
			createdAt: 3_000,
		})
		const serverCopy = messageContentFactory.build({
			id: 3007,
			createdAt: 3_000,
		})

		const merged = mergeChatHistory([optimisticSend], [serverCopy])

		expect(merged).toHaveLength(1)
		expect(merged[0].state).toBe(MessageState.SENT)
	})

	test("keeps FAILED messages in cache when poll returns nothing for them", () => {
		const failedSend = failedMessageContentFactory.build({
			id: 4007,
			createdAt: 4_000,
		})
		const raymondReply = messageContentFactory.build({
			id: 5001,
			authorId: 1,
			createdAt: 5_000,
		})

		const merged = mergeChatHistory([failedSend], [raymondReply])

		expect(merged).toHaveLength(2)
		expect(merged.find((message) => message.id === 4007)?.state).toBe(
			MessageState.FAILED,
		)
	})

	test("preserves order when appending incremental server messages", () => {
		const existing = [
			messageContentFactory.build({ id: 1007, createdAt: 1_000 }),
		]
		const newFromServer = [
			messageContentFactory.build({ id: 2001, authorId: 1, createdAt: 2_000 }),
			messageContentFactory.build({ id: 3001, authorId: 1, createdAt: 3_000 }),
		]

		const merged = mergeChatHistory(existing, newFromServer)

		expect(merged.map((message) => message.id)).toEqual([1007, 2001, 3001])
	})
})
