import { describe, expect, it } from "vitest"
import TextPart from "@/features/conversation/components/text-part.tsx"
import { render } from "@testing-library/react"
import { teammateFactory } from "@/test/factory/teammate.ts"
import {
	makeTextNode,
	MessageState,
} from "@/features/conversation/interface/text-node.ts"

describe("Text Component", () => {
	it("dims when message is sending", async () => {
		const author = teammateFactory.build()
		const { container } = render(
			<TextPart
				author={author}
				nodes={[makeTextNode("Hello")]}
				state={MessageState.SENDING}
			/>,
		)
		const row = container.firstChild as HTMLElement
		expect(row.className).toContain("opacity-50")
		expect(row.className).toContain("delay-300")
		expect(row.className).toContain("transition-opacity")
	})

	it("does not dim message is sent", async () => {
		const author = teammateFactory.build()
		const { container } = render(
			<TextPart
				author={author}
				nodes={[makeTextNode("Hello")]}
				state={MessageState.SENT}
			/>,
		)
		const row = container.firstChild as HTMLElement
		expect(row.className).toContain("opacity-100")
	})
})
