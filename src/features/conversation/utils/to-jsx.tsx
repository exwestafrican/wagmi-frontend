import type { TextNode } from "@/features/conversation/interface/text-node.ts"
import { SPACE } from "@/features/conversation/hooks/text-node.tsx"
import { Fragment } from "react"

function inRange(start: number, end: number, current: number) {
	return current >= start && current <= end
}

export default function toJSX(node: TextNode) {
	// const annotations = node.annotations.map((annotation) => annotation.range)
	const annotations = node.annotations
	let currentRangeIdx = 0
	const maxIndex = annotations.length - 1

	if (annotations.length === 0) {
		return (
			<p className="text-sm font-normal tracking-tight">
				{node.content.join(SPACE)}
			</p>
		)
	}

	const annotatedText = node.content.map((c, index) => {
		const annotation = annotations[currentRangeIdx]
		const [start, end] = annotation.range
		if (inRange(start, end, index)) {
			currentRangeIdx = Math.min(currentRangeIdx + 1, maxIndex)
			return (
				<a
					key={`${start}-${end}`}
					href={annotation.value}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs font-normal tracking-tight text-blue-600 underline hover:text-blue-800 cursor-pointer"
				>
					{c}
				</a>
			)
		}
		//the space here is important
		// biome-ignore lint/suspicious/noArrayIndexKey: static word tokens, never reordered
		return <Fragment key={`${start}-${end}-${index}`}>{c} </Fragment>
	})

	return <p className="text-sm font-normal tracking-tight">{annotatedText}</p>
}
