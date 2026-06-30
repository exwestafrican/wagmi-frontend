import {
	type Annotations,
	type AnnotationType,
	makeDefaultTextNode,
	type NodeType,
	type TextNode,
} from "@/features/conversation/interface/text-node.ts"
import { useRef } from "react"
import isUrlHttp from "is-url-http"

export const NEW_LINE = "\n"
export const SPACE = " "

export default function useTextNodeParser(type = "p" as NodeType) {
	const rawTextRef = useRef<string[]>([]) // so we persist between re renders

	function indexText(text: string) {
		return text.split(" ")
	}

	function setText(text: string) {
		rawTextRef.current = indexText(text)
	}

	function makeTextNode(text: string) {
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

	function build(): TextNode[] {
		return rawTextRef.current
			.join(SPACE)
			.split(NEW_LINE)
			.filter((text) => text.trim().length > 0)
			.map((text) => makeTextNode(text))
	}

	return {
		setText: setText,
		build: build,
	}
}
