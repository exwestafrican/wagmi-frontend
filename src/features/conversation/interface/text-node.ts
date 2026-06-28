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

export function makeDefaultTextNode(id: string, text: string, type = "p" as NodeType) {
	return {
		id: id,
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
