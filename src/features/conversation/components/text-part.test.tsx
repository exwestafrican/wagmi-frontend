import { describe, expect, it } from "vitest"
import TextPart from "@/features/conversation/components/text-part.tsx"
import { teammateFactory } from "@/test/factory/teammate.ts"
import {
	makeTextNode,
	MessageState,
} from "@/features/conversation/interface/text-node.ts"
import renderWithQueryClient from "@/common/renderWithQueryClient.tsx"
import { screen } from "@testing-library/react"

describe("Text Component", () => {
	it("dims when message is sending", async () => {
		const author = teammateFactory.build()
		const message = {
			id: 1,
			authorId: author.id,
			nodes: [makeTextNode("Hello")],
			state: MessageState.SENDING,
			createdAt: Date.now(),
		}
		const { container } = renderWithQueryClient(
			<TextPart
				author={author}
				message={message}
				workspaceCode={"902srq"}
				conversationId={1}
			/>,
		)
		const row = container.firstChild as HTMLElement
		expect(row.className).toContain("opacity-50")
		expect(row.className).toContain("delay-300")
		expect(row.className).toContain("transition-opacity")
	})

	it("does not dim message is sent", async () => {
		const author = teammateFactory.build()
		const message = {
			id: 1,
			authorId: author.id,
			nodes: [makeTextNode("Hello")],
			state: MessageState.SENT,
			createdAt: Date.now(),
		}
		const { container } = renderWithQueryClient(
			<TextPart
				author={author}
				message={message}
				workspaceCode={"902srq"}
				conversationId={1}
			/>,
		)
		const row = container.firstChild as HTMLElement
		expect(row.className).toContain("opacity-100")
	})

	it("displays indicator when message fails to send", async () => {
		const author = teammateFactory.build()
		const message = {
			id: 1,
			authorId: author.id,
			nodes: [makeTextNode("Hello")],
			state: MessageState.FAILED,
			createdAt: Date.now(),
		}

		renderWithQueryClient(
			<TextPart
				author={author}
				message={message}
				workspaceCode={"902srq"}
				conversationId={1}
			/>,
		)

		expect(screen.getByText("Failed to send message")).toBeInTheDocument()
		expect(screen.getByText("Retry")).toBeInTheDocument()
	})
})
