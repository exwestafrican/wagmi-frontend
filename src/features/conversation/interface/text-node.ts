import { SPACE } from "@/features/conversation/hooks/text-node.tsx"
import isUrlHttp from "is-url-http"

export type TextStyle = "bold" | "italic" | "underline" | "strike"
export type AnnotationType = "link"

export type Annotations = {
	type: AnnotationType
	range: number[]
	value: string
}

export type NodeType = "p"

export type TextNode = {
	id: string
	node: NodeType
	content: string[]
	styles: Record<TextStyle, number[]>
	annotations: Annotations[]
}

export type MessageContent = {
	id: string
	authorId: number
	nodes: TextNode[]
	sent: boolean
	createdAt: number
}

export function makeTextNode(text: string, type = "p" as NodeType) {
	const words = text.split(" ")
	const annotations: Annotations[] = words
		.map((word, index) => {
			if (isUrlHttp(word)) {
				return {
					type: "link" as AnnotationType,
					range: [index, index],
					value: word,
				}
			}
		})
		.filter((v) => v !== undefined)
	return makeDefaultTextNode(text, type, annotations)
}

export function makeDefaultTextNode(
	text: string,
	type = "p" as NodeType,
	annotations: Annotations[] = [],
): TextNode {
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
		annotations: annotations,
	}
}

export function makeLinkAnnotation(
	range: number[],
	value: string,
): Annotations {
	return {
		type: "link" as AnnotationType,
		range: range,
		value: value,
	}
}
