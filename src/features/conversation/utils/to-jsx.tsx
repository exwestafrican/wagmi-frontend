import type { TextNode } from "@/features/conversation/interface/text-node.ts"
import { SPACE } from "@/features/conversation/hooks/text-node.tsx"

function inRange(start: number, end: number, current: number) {
	return current >= start && current <= end
}

export default function toJSX(node: TextNode) {
	const annotations = node.annotations.map((annotation) => annotation.range)

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
		const [start, end] = annotations[currentRangeIdx]
		if (inRange(start, end, index)) {
			currentRangeIdx = Math.min(currentRangeIdx + 1, maxIndex)
			return (
				<a
					key={`${start}-${end}`}
					href="https://github.com/exwestafrican/wagmi-frontend/pull/110"
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs font-normal tracking-tight text-blue-600 underline hover:text-blue-800 cursor-pointer"
				>
					{c}
				</a>
			)
		} else {
            //the space here is important
			return <>{c} </>
		}
	})

	return <p className="text-sm font-normal tracking-tight">{annotatedText}</p>
}
