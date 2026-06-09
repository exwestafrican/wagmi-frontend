import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

export type TextStyle = "bold" | "italic" | "underline" | "strike"

export type NodeType = "p"

export type TextNode = {
	node: NodeType
	content: string[]
	styles: Record<TextStyle, number[]>
}

export type MessageContent = {
	author: Teammate
	nodes: TextNode[]
}
