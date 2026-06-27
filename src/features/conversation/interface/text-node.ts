import { SPACE } from "@/features/conversation/hooks/text-node.tsx"

export type TextStyle = "bold" | "italic" | "underline" | "strike"

export type NodeType = "p"

export type TextNode = {
	id: string
	node: NodeType
	content: string[]
	styles: Record<TextStyle, number[]>
}

export type MessageContent = {
	id: string
	authorId: number
	nodes: TextNode[]
	sent: boolean
	createdAt: number
}

export function makeDefaultTextNode(text: string, type = "p" as NodeType) {
	return {
		id: crypto.randomUUID(),
		node: type,
		content: text.split(SPACE),
		styles: {
			bold: [],
			italic: [],
			underline: [],
			strike: [],
		},
	}
}
