import { describe, it, expect } from "vitest"
import toJSX from "@/features/conversation/utils/to-jsx.tsx"
import {
	makeLinkAnnotation,
	type NodeType,
} from "@/features/conversation/interface/text-node.ts"
import { render, screen } from "@testing-library/react"

describe("toJsx", () => {
	function baseNode(content: string[]) {
		return {
			id: "8d027a42-e0c0-4939-b401-b18b3b9658e2",
			node: "p" as NodeType,
			content: content,
			styles: {
				bold: [],
				italic: [],
				underline: [],
				strike: [],
			},
		}
	}

	it("adds anchor tags where url is present ", () => {
		const node = {
			...baseNode(["https://github.com/exwestafrican/wagmi-frontend/pull/110"]),
			annotations: [
				makeLinkAnnotation(
					[0, 0],
					"https://github.com/exwestafrican/wagmi-frontend/pull/110",
				),
			],
		}

		render(toJSX(node))
		expect(screen.getByRole("link")).toHaveAttribute(
			"href",
			"https://github.com/exwestafrican/wagmi-frontend/pull/110",
		)
	})

	it("adds anchor tag in between text", () => {
		const url = "https://github.com/exwestafrican/wagmi-frontend/pull/110"

		const text = [
			"hey can you help review this PR https://github.com/exwestafrican/wagmi-frontend/pull/110, not urgent tbh",
		]
		const words = text.flatMap((item) => item.split(" "))
		const node = {
			...baseNode(words),
			annotations: [makeLinkAnnotation([7, 7], url)],
		}

		render(toJSX(node))

		expect(
			screen.getByText(/hey can you help review this PR/i),
		).toBeInTheDocument()

		expect(screen.getByText(/not urgent tbh/i)).toBeInTheDocument()

		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("href", url)
		expect(screen.getAllByRole("link")).toHaveLength(1)
		expect(link).toHaveTextContent(url)
	})

	it("add anchor tag to end of word", () => {
		const url = "https://github.com/exwestafrican/wagmi-frontend/pull/110"

		const text = [
			"hey can you help review this PR https://github.com/exwestafrican/wagmi-frontend/pull/110.",
		]
		const words = text.flatMap((item) => item.split(" "))
		const node = {
			...baseNode(words),
			annotations: [makeLinkAnnotation([7, 7], url)],
		}

		render(toJSX(node))

		expect(
			screen.getByText(/hey can you help review this PR/i),
		).toBeInTheDocument()

		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("href", url)
		expect(screen.getAllByRole("link")).toHaveLength(1)
		expect(link).toHaveTextContent(url)
	})
})
