import {
	makeDefaultTextNode,
	type NodeType,
	type TextNode,
} from "@/features/conversation/interface/text-node.ts"
import { useRef } from "react"

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
		return makeDefaultTextNode(text, type)
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
